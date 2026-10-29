import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`💊 Medicine Reminder Backend is active!`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔍 Health check:      http://localhost:${PORT}/api/health`);
  console.log(`🔐 Google Auth URL:   http://localhost:${PORT}/api/auth/google/url`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
const handleShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
