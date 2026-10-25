import { google } from 'googleapis';
import { calculateReminderTime, buildRecurrenceRule, adjustTimeByMinutes, formatCalendarDateTime } from '../utils/timeUtils.js';

/**
 * Initializes the Google Calendar API client with given OAuth2 client
 */
export const getCalendarClient = (authClient) => {
  return google.calendar({ version: 'v3', auth: authClient });
};

/**
 * Creates Google Calendar events with recurring reminders for each prescribed tablet
 * @param {OAuth2Client} authClient - Authenticated Google OAuth2 client
 * @param {Array} medicines - List of extracted medicines
 * @param {Object} mealTimings - User's meal timings { breakfast, lunch, dinner }
 * @param {string} timeZone - Timezone identifier (e.g. "Asia/Kolkata")
 * @param {string} startDate - Starting date for medications (YYYY-MM-DD)
 * @returns {Promise<Array>} List of created calendar event details
 */
export const createMedicineReminders = async (
  authClient,
  medicines,
  mealTimings,
  timeZone = 'Asia/Kolkata',
  startDate = null
) => {
  const calendar = getCalendarClient(authClient);
  const scheduledEvents = [];
  const errors = [];

  const slots = ['breakfast', 'lunch', 'dinner'];

  for (const med of medicines) {
    for (const slot of slots) {
      // Check if medicine is prescribed for this slot
      if (med.timings && med.timings[slot]) {
        try {
          const { startDateTime, endDateTime, reminderTimeStr } = calculateReminderTime(
            slot,
            med.foodTiming || 'after_food',
            mealTimings,
            startDate
          );

          const durationDays = med.durationDays || 5;
          const foodTimingLabel = (med.foodTiming || 'after_food').replace(/_/g, ' ');

          const eventBody = {
            summary: `💊 Take ${med.name} - ${slot.toUpperCase()}`,
            description: [
              `Tablet: ${med.name}`,
              `Dosage: ${med.dosage || '1 unit'}`,
              `Schedule: ${slot.toUpperCase()} (${foodTimingLabel})`,
              med.frequencyNotation ? `Prescription notation: ${med.frequencyNotation}` : '',
              med.specialInstructions ? `Special Instructions: ${med.specialInstructions}` : '',
              `Duration: ${durationDays} days`,
              '',
              'Created by Medicine Reminder System'
            ].filter(Boolean).join('\n'),
            start: {
              dateTime: startDateTime,
              timeZone: timeZone
            },
            end: {
              dateTime: endDateTime,
              timeZone: timeZone
            },
            recurrence: buildRecurrenceRule(durationDays),
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'popup', minutes: 10 },
                { method: 'popup', minutes: 0 },
                { method: 'email', minutes: 15 }
              ]
            },
            // Color IDs in Google Calendar: 2: Green (breakfast), 5: Yellow (lunch), 11: Red (dinner)
            colorId: slot === 'breakfast' ? '2' : slot === 'lunch' ? '5' : '11'
          };

          const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: eventBody
          });

          scheduledEvents.push({
            medicineName: med.name,
            dosage: med.dosage,
            slot: slot,
            foodTiming: med.foodTiming,
            reminderTime: reminderTimeStr,
            durationDays: durationDays,
            eventId: response.data.id,
            htmlLink: response.data.htmlLink,
            startDateTime: startDateTime
          });
        } catch (slotError) {
          console.error(`Failed to create calendar event for ${med.name} (${slot}):`, slotError);
          errors.push({
            medicine: med.name,
            slot: slot,
            error: slotError.message
          });
        }
      }
    }
  }

  return { scheduledEvents, errors };
};

/**
 * Creates a Google Calendar reminder event for the next doctor check-up / follow-up appointment
 * @param {OAuth2Client} authClient - Authenticated Google OAuth2 client
 * @param {Object} checkupData - Details of the checkup
 * @returns {Promise<Object>} Created checkup event details
 */
export const createDoctorCheckupEvent = async (authClient, checkupData) => {
  const {
    doctorName,
    clinicName,
    appointmentDateTime, // ISO string: "YYYY-MM-DDTHH:mm:ss" or Date
    timeZone = 'Asia/Kolkata',
    notes,
    durationMinutes = 60
  } = checkupData;

  if (!appointmentDateTime) {
    throw new Error('appointmentDateTime is required to schedule a doctor check-up.');
  }

  const calendar = getCalendarClient(authClient);

  // Compute end time (durationMinutes after start)
  const startDate = new Date(appointmentDateTime);
  if (isNaN(startDate.getTime())) {
    throw new Error('Invalid appointmentDateTime format. Provide ISO string (e.g. 2026-11-05T10:00:00).');
  }

  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const startIso = formatCalendarDateTime(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    startDate.getSeconds()
  );

  const endIso = formatCalendarDateTime(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    endDate.getSeconds()
  );

  const summary = `🩺 Doctor Check-Up: ${doctorName || clinicName || 'Medical Follow-Up'}`;
  const description = [
    `Doctor: ${doctorName || 'Not specified'}`,
    clinicName ? `Clinic / Hospital: ${clinicName}` : '',
    notes ? `Notes / Instructions: ${notes}` : '',
    '',
    '⚠️ Please remember to bring previous prescriptions, lab reports, and current medication list.',
    '',
    'Scheduled via Medicine Reminder System'
  ].filter(Boolean).join('\n');

  const eventBody = {
    summary,
    description,
    start: {
      dateTime: startIso,
      timeZone: timeZone
    },
    end: {
      dateTime: endIso,
      timeZone: timeZone
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 1 day before
        { method: 'email', minutes: 1440 }, // 1 day before
        { method: 'popup', minutes: 120 },  // 2 hours before
        { method: 'popup', minutes: 30 }    // 30 minutes before
      ]
    },
    colorId: '9' // Blueberry / Dark Blue for medical appointments
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: eventBody
  });

  return {
    eventId: response.data.id,
    summary: response.data.summary,
    start: response.data.start,
    end: response.data.end,
    htmlLink: response.data.htmlLink,
    status: response.data.status
  };
};
