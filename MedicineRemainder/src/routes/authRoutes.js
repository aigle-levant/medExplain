import { Router } from 'express';
import {
  getGoogleAuthUrl,
  handleGoogleCallback,
  exchangeCode
} from '../controllers/authController.js';

const router = Router();

// GET /api/auth/google/url - Get authorization URL to grant calendar permissions
router.get('/google/url', getGoogleAuthUrl);

// GET /api/auth/google/callback - OAuth2 redirect handler
router.get('/google/callback', handleGoogleCallback);

// POST /api/auth/google/exchange - Exchange authorization code for tokens
router.post('/google/exchange', exchangeCode);

export default router;
