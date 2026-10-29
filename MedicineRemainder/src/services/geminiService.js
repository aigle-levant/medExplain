import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * System prompt instructing Gemini to analyze the prescription and return structured JSON
 */
const PRESCRIPTION_EXTRACTION_PROMPT = `
You are an expert medical transcription and AI prescription analysis assistant.
Analyze the provided medical prescription image or PDF document and extract all prescribed medicines and check-up information.

Return your response strictly as a valid JSON object matching this exact structure:
{
  "doctorName": "Doctor's name if visible, or null",
  "clinicOrHospital": "Clinic or hospital name if visible, or null",
  "prescriptionDate": "Prescription date in YYYY-MM-DD if visible, or null",
  "patientName": "Patient name if visible, or null",
  "medicines": [
    {
      "name": "Full tablet/medicine name with strength (e.g., Amoxicillin 500mg, Pan 40)",
      "dosage": "Dosage unit (e.g., 1 tablet, 5ml, 1 capsule)",
      "frequencyNotation": "Original prescription shorthand if present (e.g., '1-0-1', 'BD', 'TDS', 'OD')",
      "timings": {
        "breakfast": true, // true if to be taken in the morning/breakfast
        "lunch": false,    // true if to be taken in the afternoon/lunch
        "dinner": true     // true if to be taken at night/dinner
      },
      "foodTiming": "before_food" | "after_food" | "with_food", // standard enum
      "durationDays": 5, // number of days to take this tablet. If not specified, default to 5.
      "specialInstructions": "Any additional directions (e.g., 'Take with warm water', 'Avoid dairy')"
    }
  ],
  "doctorCheckup": {
    "mentioned": true, // true if follow-up/review is mentioned
    "followUpInDays": 5, // number of days until next visit if mentioned (e.g. 'Review after 5 days' -> 5), else null
    "suggestedDate": "YYYY-MM-DD or null if not explicitly dated",
    "instructions": "Follow up instructions (e.g. 'Review after 5 days with CBC test report') or null"
  }
}

Medical abbreviation guidelines:
- 1-0-1: breakfast=true, lunch=false, dinner=true
- 1-1-1: breakfast=true, lunch=true, dinner=true
- 1-0-0: breakfast=true, lunch=false, dinner=false
- 0-1-0: breakfast=false, lunch=true, dinner=false
- 0-0-1: breakfast=false, lunch=false, dinner=true
- OD: Once daily -> usually breakfast=true, lunch=false, dinner=false
- BD or BID: Twice daily -> breakfast=true, lunch=false, dinner=true
- TDS or TID: Thrice daily -> breakfast=true, lunch=true, dinner=true
- QID: Four times daily -> breakfast=true, lunch=true, dinner=true
- BBF / AC / Before food / Empty stomach -> foodTiming: "before_food"
- AF / PC / After food / After meals -> foodTiming: "after_food"
- Default foodTiming to "after_food" if not specified.
- Default durationDays to 5 if not explicitly mentioned.

Return ONLY the raw JSON object, without markdown code fences or conversational text.
`;

/**
 * Extracts structured medicine details from an image or PDF file buffer
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - e.g. "image/jpeg", "image/png", "application/pdf"
 * @returns {Promise<Object>} Parsed prescription object
 */
export const parsePrescriptionWithGemini = async (fileBuffer, mimeType) => {
  const genAI = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1 // Low temperature for high accuracy extraction
    }
  });

  const filePart = {
    inlineData: {
      data: fileBuffer.toString('base64'),
      mimeType: mimeType
    }
  };

  try {
    const result = await model.generateContent([PRESCRIPTION_EXTRACTION_PROMPT, filePart]);
    const response = await result.response;
    const text = response.text();

    // Clean possible markdown code formatting if any
    const cleanedText = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsedData = JSON.parse(cleanedText);
    return parsedData;
  } catch (error) {
    console.error('Error parsing prescription with Gemini:', error);
    throw new Error(`Failed to parse prescription with Gemini AI: ${error.message}`);
  }
};
