import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { createWorker } from 'tesseract.js';
import { getAuthUrl } from './src/config/google.js';
import { parsePrescriptionWithGroq } from './src/services/groqService.js';

dotenv.config();

console.log('========================================================');
console.log('🩺 MEDICINE REMINDER BACKEND - DIAGNOSTICS & TEST SUITE');
console.log('========================================================\n');

let allPassed = true;

// 1. Check Google OAuth URL Generation
console.log('1️⃣ Checking Google OAuth2 Configuration...');
try {
  const authUrl = getAuthUrl();
  if (authUrl && authUrl.startsWith('https://accounts.google.com')) {
    console.log('   ✅ Google OAuth Client configured successfully!');
    console.log(`   🔗 Auth URL generated: ${authUrl.slice(0, 60)}...\n`);
  } else {
    throw new Error('Invalid URL returned');
  }
} catch (err) {
  allPassed = false;
  console.error('   ❌ Google OAuth configuration error:', err.message, '\n');
}

// 2. Check Tesseract OCR Engine
console.log('2️⃣ Checking Local Tesseract OCR Engine...');
try {
  const worker = await createWorker('eng');
  console.log('   ✅ Tesseract OCR worker initialized successfully!');
  await worker.terminate();
  console.log('   ✅ Tesseract engine closed cleanly.\n');
} catch (err) {
  allPassed = false;
  console.error('   ❌ Tesseract OCR error:', err.message, '\n');
}

// 3. Check Groq API Connectivity & Llama 3 Parsing
console.log('3️⃣ Checking Groq API Connection (Live test)...');
try {
  const sampleOcrText = `
    Dr. Sharma Clinic, Reg No: 88472
    Rx:
    1. Tab Amoxicillin 500mg 1-0-1 AF x 5 days
    2. Tab Pantoprazole 40mg 1-0-0 BBF x 5 days
    Follow-up with blood count after 5 days.
  `;

  console.log('   ⏳ Sending sample medical text to Groq Cloud...');
  const result = await parsePrescriptionWithGroq(sampleOcrText);

  if (result.medicines && result.medicines.length === 2) {
    console.log('   ✅ Groq API connected and returned valid clinical JSON!');
    console.log(`   💊 Detected Medicines: ${result.medicines.map(m => m.name).join(', ')}`);
    console.log(`   🩺 Detected Check-up: In ${result.doctorCheckup?.followUpInDays} days (${result.doctorCheckup?.instructions})\n`);
  } else {
    throw new Error('Groq response did not contain expected medicines');
  }
} catch (err) {
  allPassed = false;
  console.error('   ❌ Groq API error:', err.message, '\n');
}

console.log('========================================================');
if (allPassed) {
  console.log('🎉 ALL SYSTEM CHECKS PASSED! Your backend is ready to run.');
} else {
  console.log('⚠️ Some checks failed. Please inspect the errors above.');
}
console.log('========================================================');
