import { Router } from 'express';
import { scheduleDoctorCheckup } from '../controllers/checkupController.js';

const router = Router();

// POST /api/checkup/schedule - Schedule doctor check-up / follow up reminder in Google Calendar
router.post('/schedule', scheduleDoctorCheckup);

export default router;
