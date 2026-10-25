import { getAuthenticatedClient } from '../config/google.js';

/**
 * Extracts Google OAuth2 tokens from request headers, body, or environment
 */
export const extractGoogleTokens = (req) => {
  let accessToken = null;
  let refreshToken = null;

  // 1. From custom headers
  if (req.headers['x-google-access-token']) {
    accessToken = req.headers['x-google-access-token'];
  }
  if (req.headers['x-google-refresh-token']) {
    refreshToken = req.headers['x-google-refresh-token'];
  }

  // 2. From standard Authorization Bearer header
  if (!accessToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    accessToken = req.headers.authorization.split(' ')[1];
  }

  // 3. From request body (JSON or multipart fields)
  if (req.body) {
    if (req.body.accessToken) accessToken = req.body.accessToken;
    if (req.body.access_token) accessToken = req.body.access_token;
    if (req.body['x-google-access-token']) accessToken = req.body['x-google-access-token'];

    if (req.body.refreshToken) refreshToken = req.body.refreshToken;
    if (req.body.refresh_token) refreshToken = req.body.refresh_token;
    if (req.body['x-google-refresh-token']) refreshToken = req.body['x-google-refresh-token'];

    if (req.body.googleTokens) {
      const tokensObj = typeof req.body.googleTokens === 'string'
        ? JSON.parse(req.body.googleTokens)
        : req.body.googleTokens;
      if (tokensObj.access_token || tokensObj.accessToken) {
        accessToken = tokensObj.access_token || tokensObj.accessToken;
      }
      if (tokensObj.refresh_token || tokensObj.refreshToken) {
        refreshToken = tokensObj.refresh_token || tokensObj.refreshToken;
      }
    }
  }

  // 4. Fallback to process.env for local development / single-user setups
  if (!refreshToken && process.env.GOOGLE_REFRESH_TOKEN) {
    refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  }

  return { accessToken, refreshToken };
};

/**
 * Resolves an authenticated Google OAuth2 client or returns null if not configured
 */
export const resolveAuthClient = (req) => {
  const tokens = extractGoogleTokens(req);
  if (!tokens.accessToken && !tokens.refreshToken) {
    return null;
  }
  return getAuthenticatedClient(tokens);
};
