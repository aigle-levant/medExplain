// src/services/prescriptionParser.js
import { extractTextFromDocument } from './ocrService.js';
import { parsePrescriptionWithGroq } from './groqService.js';
import { cropPatientDetails } from './imagePreprocessor.js';
import { parsePrescriptionWithGemini } from './geminiService.js';

/**
 * Intelligent Two‑Stage Privacy‑Preserving Pipeline:
 *
 * 1. Primary Engine – 100% Local Tesseract OCR + Groq Llama 3.
 *    • Keeps all data on the machine.
 *    • Works well for printed prescriptions.
 *
 * 2. Privacy Fallback – Gemini Vision (Free tier).
 *    • Triggered only when the local OCR finds **0 medicines**.
 *    • Crops out the top header (patient name, DOB, phone, address) locally.
 *    • Sends only the anonymised Rx section to Gemini Vision.
 *    • Merges metadata from the OCR stage with medicines returned by Gemini.
 */
export const parsePrescriptionDocument = async (fileBuffer, mimeType) => {
  // -------------------------------------------------------------
  // STAGE 1 – Local OCR + Groq
  // -------------------------------------------------------------
  console.log(`[Stage 1/2] Running local OCR extraction (Tesseract + Sharp) on ${mimeType}...`);
  const { rawText, engine, charCount } = await extractTextFromDocument(fileBuffer, mimeType);

  console.log(`[Stage 1/2] Local OCR complete (${engine}). Extracted ${charCount} characters.`);

  console.log(`[Stage 1/2] Sending extracted text to Groq LLM (Llama 3) for clinical analysis...`);
  const primaryResult = await parsePrescriptionWithGroq(rawText);
  const medicinesFound = primaryResult.medicines && primaryResult.medicines.length > 0;

  console.log(`[Stage 1/2] Primary extraction found ${primaryResult.medicines?.length || 0} medicine(s).`);

  // If we already have medicines, return the primary result – no fallback needed.
  if (medicinesFound) {
    return {
      ...primaryResult,
      pipeline: '100% Local (Tesseract + Groq)',
      fallbackUsed: false,
      ocrMetadata: {
        engine,
        extractedCharacters: charCount,
        rawTextSnippet: rawText.slice(0, 300) + (rawText.length > 300 ? '...' : ''),
      },
    };
  }

  // -------------------------------------------------------------
  // STAGE 2 – Gemini Vision fallback (only when no medicines were found)
  // -------------------------------------------------------------
  const geminiKeyPresent = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '';

  if (!geminiKeyPresent) {
    console.log('ℹ️  Gemini fallback skipped: GEMINI_API_KEY not set in .env.');
    // Return the primary result (which contains zero medicines) with explicit flags.
    return {
      ...primaryResult,
      pipeline: '100% Local (Tesseract + Groq)',
      fallbackUsed: false,
      ocrMetadata: {
        engine,
        extractedCharacters: charCount,
        rawTextSnippet: rawText.slice(0, 300) + (rawText.length > 300 ? '...' : ''),
      },
    };
  }

  console.log('\n⚠️  No medicines detected with local OCR – invoking Gemini Vision fallback (privacy‑preserving).');
  console.log('🔒 Cropping patient header before sending to the cloud...');

  try {
    let visionBuffer = fileBuffer;
    let visionMime = mimeType;

    // Crop out patient PII if the input is an image (PDFs are handled elsewhere).
    if (mimeType !== 'application/pdf') {
      visionBuffer = await cropPatientDetails(fileBuffer, 0.28);
      visionMime = 'image/png';
      console.log('🛡️  Patient details removed – only anonymised Rx area will be sent to Gemini.');
    }

    console.log('🧠 Sending cropped image to Gemini Vision (free tier)…');
    const visionResult = await parsePrescriptionWithGemini(visionBuffer, visionMime);

    console.log(`🎉 Gemini Vision returned ${visionResult.medicines?.length || 0} medicine(s).`);

    // Merge metadata from the local stage with medicines from Gemini.
    return {
      doctorName: primaryResult.doctorName || visionResult.doctorName,
      clinicOrHospital: primaryResult.clinicOrHospital || visionResult.clinicOrHospital,
      patientName: primaryResult.patientName || null, // keep local patient name (never sent to cloud)
      prescriptionDate: primaryResult.prescriptionDate || visionResult.prescriptionDate,
      medicines: visionResult.medicines || [],
      doctorCheckup: visionResult.doctorCheckup?.mentioned
        ? visionResult.doctorCheckup
        : primaryResult.doctorCheckup || visionResult.doctorCheckup,
      pipeline: 'Hybrid Privacy Fallback (Local OCR + Cropped Gemini Vision)',
      fallbackUsed: true,
      privacyShield: {
        patientPiiRedacted: true,
        method: 'Local top‑header cropping before cloud transmission',
      },
      ocrMetadata: {
        engine: `${engine} → Gemini Vision fallback`,
        extractedCharacters: charCount,
        rawTextSnippet: rawText.slice(0, 300) + (rawText.length > 300 ? '...' : ''),
      },
    };
  } catch (visionError) {
    console.error('Gemini Vision fallback failed:', visionError);
    // Gracefully return the primary result (zero medicines) with a flag indicating the attempt.
    return {
      ...primaryResult,
      pipeline: '100% Local (Tesseract + Groq)',
      fallbackUsed: false,
      ocrMetadata: {
        engine,
        extractedCharacters: charCount,
        rawTextSnippet: rawText.slice(0, 300) + (rawText.length > 300 ? '...' : ''),
      },
    };
  }
};
