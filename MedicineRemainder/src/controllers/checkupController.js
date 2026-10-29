import { createDoctorCheckupEvent } from '../services/calendarService.js';
import { resolveAuthClient } from '../utils/tokenExtractor.js';

/**
 * Schedules a doctor check-up reminder event in Google Calendar
 */
export const scheduleDoctorCheckup = async (req, res) => {
  try {
    const {
      doctorName,
      clinicName,
      appointmentDateTime,
      timeZone,
      notes,
      durationMinutes
    } = req.body;

    if (!appointmentDateTime) {
      return res.status(400).json({
        success: false,
        message: 'appointmentDateTime is required (ISO 8601 string, e.g. "2026-11-05T10:00:00").'
      });
    }

    const authClient = resolveAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google Calendar authentication required. Please connect your Google account or provide OAuth tokens.'
      });
    }

    const resolvedTimeZone = timeZone || process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata';

    const checkupResult = await createDoctorCheckupEvent(authClient, {
      doctorName,
      clinicName,
      appointmentDateTime,
      timeZone: resolvedTimeZone,
      notes,
      durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 60
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor check-up reminder successfully added to Google Calendar!',
      checkup: {
        doctorName: doctorName || 'Doctor',
        clinicName: clinicName || null,
        appointmentTime: appointmentDateTime,
        timeZone: resolvedTimeZone,
        calendarEventId: checkupResult.eventId,
        googleCalendarLink: checkupResult.htmlLink,
        notifications: [
          'Email & Popup reminder 1 day before',
          'Popup reminder 2 hours before',
          'Popup reminder 30 minutes before'
        ]
      }
    });
  } catch (error) {
    console.error('Error scheduling doctor checkup:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to schedule doctor checkup in Google Calendar',
      error: error.message
    });
  }
};
