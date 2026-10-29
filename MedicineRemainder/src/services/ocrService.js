import { createWorker } from 'tesseract.js';
import { PDFParse } from 'pdf-parse';
import { preprocessImageForOcr } from './imagePreprocessor.js';

/**
 * Extracts raw text from an image buffer using Sharp image enhancement + Tesseract OCR
 * @param {Buffer} imageBuffer - Original image file buffer (JPEG, PNG, WEBP)
 * @returns {Promise<string>} Extracted raw text
 */
export const extractTextFromImage = async (imageBuffer) => {
  let worker = null;
  try {
    // Stage A: Enhance image locally with Sharp (contrast normalization, grayscale, sharpening)
    const enhancedBuffer = await preprocessImageForOcr(imageBuffer);

    worker = await createWorker('eng');

    // Stage B - Pass 1: PSM 6 (Uniform block - best for tabular & column prescriptions)
    await worker.setParameters({ tessedit_pageseg_mode: '6' });
    let { data } = await worker.recognize(enhancedBuffer);
    let extractedText = data.text || '';

    // Stage B - Pass 2: If Pass 1 produced few characters, try PSM 11 (Sparse text)
    if (extractedText.trim().length < 150) {
      await worker.setParameters({ tessedit_pageseg_mode: '11' });
      const pass2 = await worker.recognize(enhancedBuffer);
      if (pass2.data.text && pass2.data.text.trim().length > extractedText.trim().length) {
        extractedText = pass2.data.text;
      }
    }

    return extractedText || '';
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    throw new Error(`Tesseract OCR failed to process image: ${err.message}`);
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};

/**
 * Extracts text from a PDF buffer using PDFParse
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} Extracted raw text
 */
export const extractTextFromPdf = async (pdfBuffer) => {
  let parser = null;
  try {
    parser = new PDFParse({ data: pdfBuffer });
    const result = await parser.getText();
    return result.text || '';
  } catch (err) {
    console.error('PDF parsing error:', err);
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      await parser.destroy();
    }
  }
};

/**
 * Unified text extractor for images and PDFs with local image enhancement
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - MIME type
 * @returns {Promise<{ rawText: string, engine: string, charCount: number }>}
 */
export const extractTextFromDocument = async (fileBuffer, mimeType) => {
  let rawText = '';
  let engine = 'tesseract.js';

  if (mimeType === 'application/pdf') {
    engine = 'pdf-parse';
    rawText = await extractTextFromPdf(fileBuffer);
  } else {
    engine = 'tesseract.js + sharp';
    rawText = await extractTextFromImage(fileBuffer);
  }

  const cleanedText = rawText.trim();

  return {
    rawText: cleanedText,
    engine,
    charCount: cleanedText.length
  };
};
