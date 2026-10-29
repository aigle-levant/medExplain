import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined in environment variables. Get a free key at https://console.groq.com/keys');
  }
  return new Groq({ apiKey });
};

const SYSTEM_PROMPT = `
You are an expert clinical pharmacologist and medical prescription transcription AI.
You are given raw OCR text extracted from a medical prescription. 
The OCR text may contain typos, misspellings, optical noise, and medical abbreviations (e.g. '1-0-1', 'OD', 'TDS', 'BD', 'BBF', 'PC', 'AF').

Your task is to interpret the noisy OCR text, correct obvious OCR misspellings in medicine names, and extract all prescribed tablets, intake timings, durations, and doctor check-up information.

Return your response strictly as a JSON object matching this schema:
{
  "doctorName": "Doctor's name if identified, or null",
  "clinicOrHospital": "Clinic or hospital name if identified, or null",
  "prescriptionDate": "Prescription date in YYYY-MM-DD if found, or null",
  "patientName": "Patient name if identified, or null",
  "medicines": [
    {
      "name": "Full tablet/medicine name with strength (e.g., Amoxicillin 500mg, Pantoprazole 40mg)",
      "dosage": "Dosage unit (e.g., 1 tablet, 1 capsule, 5ml)",
      "frequencyNotation": "Prescription shorthand if present (e.g., '1-0-1', 'BD', 'TDS', 'OD')",
      "timings": {
        "breakfast": true, // true if to be taken in the morning/breakfast
        "lunch": false,    // true if to be taken in the afternoon/lunch
        "dinner": true     // true if to be taken at night/dinner
      },
      "foodTiming": "before_food" | "after_food" | "with_food",
      "durationDays": 5, // number of days to take this tablet. If not specified, default to 5.
      "specialInstructions": "Any additional directions (e.g., 'Take with plenty of water', 'Empty stomach')"
    }
  ],
  "doctorCheckup": {
    "mentioned": true, // true if follow-up/review is mentioned
    "followUpInDays": 5, // number of days until next visit if mentioned, else null
    "suggestedDate": "YYYY-MM-DD or null if not explicitly dated",
    "instructions": "Follow up instructions (e.g. 'Review after 5 days with fever report') or null"
  }
}

Medical abbreviation rules:
- 1-0-1: breakfast=true, lunch=false, dinner=true
- 1-1-1: breakfast=true, lunch=true, dinner=true
- 1-0-0: breakfast=true, lunch=false, dinner=false
- 0-1-0: breakfast=false, lunch=true, dinner=false
- 0-0-1: breakfast=false, lunch=false, dinner=true
- OD: Once daily -> breakfast=true, lunch=false, dinner=false
- BD or BID: Twice daily -> breakfast=true, lunch=false, dinner=true
- TDS or TID: Thrice daily -> breakfast=true, lunch=true, dinner=true
- QID: Four times daily -> breakfast=true, lunch=true, dinner=true
- BBF / AC / Before meals / Empty stomach -> foodTiming: "before_food"
- AF / PC / After meals -> foodTiming: "after_food"
- Default foodTiming to "after_food" if not specified.
- Default durationDays to 5 if not explicitly mentioned.

Return ONLY the raw JSON object. Do not include markdown tags, conversational filler, or commentary.
`;

/**
 * Uses Groq LLM (Llama 3) to convert raw OCR text into structured prescription JSON
 * @param {string} rawOcrText - Unstructured text produced by Tesseract or PDFParse
 * @returns {Promise<Object>} Structured prescription data
 */
export const parsePrescriptionWithGroq = async (rawOcrText) => {
  if (!rawOcrText || rawOcrText.trim().length === 0) {
    throw new Error('OCR text is empty. Tesseract could not detect any readable text in the uploaded document.');
  }

  const groq = getGroqClient();
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

  const userPrompt = `
Here is the raw OCR text extracted from the medical prescription:
---
${rawOcrText}
---

Parse and extract all tablets, timings, and checkup information according to the JSON format.
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      model: model,
      temperature: 0.1, // Low temperature for factual precision
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response received from Groq LLM');
    }

    // Clean possible markdown code fences
    const cleanedJson = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Error in Groq LLM processing:', error);
    throw new Error(`Groq LLM parsing failed: ${error.message}`);
  }
};
