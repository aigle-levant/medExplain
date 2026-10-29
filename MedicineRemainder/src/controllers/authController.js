import { getAuthUrl, getTokensFromCode } from '../config/google.js';

/**
 * Returns Google OAuth2 authorization URL
 */
export const getGoogleAuthUrl = (req, res) => {
  try {
    const url = getAuthUrl();
    return res.status(200).json({
      success: true,
      message: 'Authenticate with Google Calendar via this URL',
      authUrl: url
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Google Auth URL',
      error: error.message
    });
  }
};

/**
 * Handles OAuth callback when redirected by Google
 */
export const handleGoogleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Authorization code missing in callback query'
    });
  }

  try {
    const tokens = await getTokensFromCode(code);
    return res.status(200).json({
      success: true,
      message: 'Google authorization successful! Save these tokens to access Google Calendar.',
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to exchange authorization code for tokens',
      error: error.message
    });
  }
};

/**
 * Exchanges authorization code received by a mobile/SPA frontend for tokens
 */
export const exchangeCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Authorization code is required in request body.'
    });
  }

  try {
    const tokens = await getTokensFromCode(code);
    return res.status(200).json({
      success: true,
      tokens
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error exchanging authorization code',
      error: error.message
    });
  }
};
