import { parsePrescriptionDocument } from '../services/prescriptionParser.js';
import { createMedicineReminders, createDoctorCheckupEvent } from '../services/calendarService.js';
import { resolveAuthClient } from '../utils/tokenExtractor.js';
import { DEFAULT_MEAL_TIMINGS } from '../utils/timeUtils.js';


let cachedMealTimings = null;


const resolveMealTimings = (body) => {
  // Start from defaults
  let timings = { ...DEFAULT_MEAL_TIMINGS };

  // Load cached timings if we have them and the request didn't provide new ones.
  if (!body.mealTimings && !body.breakfastTime && !body.lunchTime && !body.dinnerTime && cachedMealTimings) {
    timings = { ...timings, ...cachedMealTimings };
  }

  // Merge any mealTimings object supplied in the request.
  if (body.mealTimings) {
    try {
      const parsed = typeof body.mealTimings === 'string'
        ? JSON.parse(body.mealTimings)
        : body.mealTimings;
      timings = { ...timings, ...parsed };
    } catch (e) {
      console.warn('Failed to parse mealTimings JSON, using defaults or individual fields');
    }
  }

  // Individual field overrides
  if (body.breakfastTime) timings.breakfast = body.breakfastTime;
  if (body.lunchTime) timings.lunch = body.lunchTime;
  if (body.dinnerTime) timings.dinner = body.dinnerTime;

  // Persist for future requests if requested.
  if (body.saveMealTimings) {
    cachedMealTimings = { ...timings };
    console.log('User meal timings cached for subsequent requests.');
  }

  return timings;
};

/**
 * Endpoint: Upload prescription, parse tablets, calculate meal-based timings,
 * schedule recurring reminders on Google Calendar, and check for doctor checkup
 */
export const uploadAndSchedulePrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Prescription file (image or PDF) is required. Use multipart form key "prescription".'
      });
    }

    const { buffer, mimetype, originalname } = req.file;
    const timeZone = req.body.timeZone || process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata';
    const startDate = req.body.startDate || null;
    const mealTimings = resolveMealTimings(req.body);

    console.log(`Analyzing prescription "${originalname}" (${mimetype})...`);

    // Step 1: Parse prescription using Tesseract OCR + Groq LLM pipeline
    const parsedData = await parsePrescriptionDocument(buffer, mimetype);

    // Step 2: Attempt Google Calendar authorization
    const authClient = resolveAuthClient(req);

    let calendarResults = {
      authenticated: !!authClient,
      scheduled: false,
      message: authClient
        ? 'Google Calendar authorized.'
        : 'Google Calendar sync skipped: No Google OAuth token provided. Pass accessToken or refresh token.',
      events: [],
      errors: []
    };

    let checkupEventResult = null;
    let checkupError = null;

    if (authClient) {
      // Determine medicines to schedule (allow user fallback medicines in request body if OCR finds none)
      let medicinesToSchedule = parsedData.medicines && parsedData.medicines.length > 0 ? parsedData.medicines : [];
      
      if (medicinesToSchedule.length === 0 && req.body.medicines) {
        try {
          const manualMeds = typeof req.body.medicines === 'string' ? JSON.parse(req.body.medicines) : req.body.medicines;
          if (Array.isArray(manualMeds) && manualMeds.length > 0) {
            medicinesToSchedule = manualMeds;
            console.log(`Using ${manualMeds.length} fallback medicine(s) provided in request body.`);
          }
        } catch (e) {
          console.warn('Failed to parse manual medicines body parameter');
        }
      }

      // Step 3: Schedule Google Calendar reminders for medicines
      if (medicinesToSchedule.length > 0) {
        const { scheduledEvents, errors } = await createMedicineReminders(
          authClient,
          medicinesToSchedule,
          mealTimings,
          timeZone,
          startDate
        );

        calendarResults = {
          authenticated: true,
          scheduled: scheduledEvents.length > 0,
          totalEventsCreated: scheduledEvents.length,
          events: scheduledEvents,
          errors: errors
        };
      } else {
        calendarResults.scheduled = false;
        calendarResults.message = 'Google Calendar is connected, but 0 medicines were found in the prescription to schedule. (Tip: You can pass a manual medicine list or use a typed prescription).';
      }

      // Step 4: If appointment date is already provided by user in the request, schedule it now
      const checkupTime = req.body.checkupDateTime || req.body.appointmentDateTime;
      if (checkupTime) {
        try {
          console.log(`Scheduling doctor appointment for ${checkupTime}...`);
          checkupEventResult = await createDoctorCheckupEvent(authClient, {
            doctorName: req.body.doctorName || parsedData.doctorName,
            clinicName: req.body.clinicName || parsedData.clinicOrHospital,
            appointmentDateTime: checkupTime,
            timeZone,
            notes: req.body.checkupNotes || parsedData.doctorCheckup?.instructions
          });
          console.log('Doctor appointment successfully scheduled in Google Calendar!');
        } catch (checkupErr) {
          console.error('Error auto-scheduling checkup from upload:', checkupErr);
          checkupError = checkupErr.message;
        }
      }
    }

    // Step 5: Structure follow-up / check-up prompt
    const checkupInfo = parsedData.doctorCheckup || {};
    const doctorCheckupPrompt = {
      isCheckupMentionedInPrescription: !!checkupInfo.mentioned,
      suggestedFollowUpDays: checkupInfo.followUpInDays || null,
      suggestedDate: checkupInfo.suggestedDate || null,
      instructions: checkupInfo.instructions || null,
      scheduled: !!checkupEventResult,
      checkupEvent: checkupEventResult,
      error: checkupError,
      promptMessage: checkupEventResult
        ? 'Your next doctor check-up has been successfully scheduled on Google Calendar!'
        : 'When is your next check-up with the doctor? Please confirm your appointment date/time to add it to your Google Calendar.',
      action: {
        method: 'POST',
        endpoint: '/api/checkup/schedule',
        payloadExample: {
          doctorName: parsedData.doctorName || 'Dr. Smith',
          clinicName: parsedData.clinicOrHospital || 'Clinic',
          appointmentDateTime: checkupInfo.suggestedDate ? `${checkupInfo.suggestedDate}T10:00:00` : 'YYYY-MM-DDTHH:mm:ss',
          timeZone: timeZone,
          notes: checkupInfo.instructions || 'Review consultation'
        }
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Prescription processed successfully',
      prescription: {
        doctorName: parsedData.doctorName,
        clinicOrHospital: parsedData.clinicOrHospital,
        patientName: parsedData.patientName,
        prescriptionDate: parsedData.prescriptionDate,
        totalMedicines: parsedData.medicines ? parsedData.medicines.length : 0,
        medicines: parsedData.medicines || []
      },
      userMealTimings: mealTimings,
      timeZone: timeZone,
      pipeline: parsedData.pipeline,
      privacyShield: parsedData.privacyShield,
      ocrMetadata: parsedData.ocrMetadata,
      calendarSync: calendarResults,
      doctorCheckupPrompt: doctorCheckupPrompt
    });
  } catch (error) {
    console.error('Error in uploadAndSchedulePrescription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process prescription',
      error: error.message
    });
  }
};

/**
 * Endpoint: Parse prescription only (without scheduling calendar events)
 * Useful for frontends that want to display extracted medicines for confirmation first
 */
export const parsePrescriptionOnly = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Prescription file (image or PDF) is required.'
      });
    }

    const { buffer, mimetype } = req.file;
    const parsedData = await parsePrescriptionDocument(buffer, mimetype);

    return res.status(200).json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error('Error in parsePrescriptionOnly:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to parse prescription',
      error: error.message
    });
  }
};

/**
 * Endpoint: Schedule Google Calendar reminders from an existing list of medicines
 * (e.g. after the user reviewed or modified them)
 */
export const scheduleMedicineReminders = async (req, res) => {
  try {
    const { medicines, timeZone, startDate } = req.body;

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'medicines array is required in request body.'
      });
    }

    const authClient = resolveAuthClient(req);
    if (!authClient) {
      return res.status(401).json({
        success: false,
        message: 'Google Calendar authentication required. Pass tokens or sign in.'
      });
    }

    const mealTimings = resolveMealTimings(req.body);
    const resolvedTimeZone = timeZone || process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata';

    const { scheduledEvents, errors } = await createMedicineReminders(
      authClient,
      medicines,
      mealTimings,
      resolvedTimeZone,
      startDate
    );

    return res.status(200).json({
      success: true,
      message: `Successfully scheduled ${scheduledEvents.length} medicine reminders in Google Calendar`,
      mealTimings,
      timeZone: resolvedTimeZone,
      events: scheduledEvents,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in scheduleMedicineReminders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to schedule medicine reminders',
      error: error.message
    });
  }
};
