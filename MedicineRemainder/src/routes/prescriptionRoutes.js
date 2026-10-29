import { Router } from 'express';
import { uploadPrescription } from '../middleware/upload.js';
import {
  uploadAndSchedulePrescription,
  parsePrescriptionOnly,
  scheduleMedicineReminders
} from '../controllers/prescriptionController.js';

const router = Router();

// POST /api/prescriptions/upload - Full flow: Upload image/pdf, parse medicines with Gemini, schedule Google Calendar events using meal times
router.post('/upload', uploadPrescription.single('prescription'), uploadAndSchedulePrescription);

// POST /api/prescriptions/parse - Parse only (preview medicines extracted from prescription before scheduling)
router.post('/parse', uploadPrescription.single('prescription'), parsePrescriptionOnly);

// POST /api/prescriptions/schedule - Schedule Google Calendar reminders from an explicit list of medicines
router.post('/schedule', scheduleMedicineReminders);

export default router;
