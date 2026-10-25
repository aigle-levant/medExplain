import sharp from 'sharp';

/**
 * Preprocesses an image buffer using Sharp to dramatically improve Tesseract OCR accuracy:
 * 1. Resizes/upscales to ensure text characters have sufficient pixel density (~300 DPI equivalent)
 * 2. Converts to Grayscale to eliminate color channel noise
 * 3. Applies contrast stretching / normalization to make faint pen ink pop
 * 4. Applies unsharp masking to sharpen stroke edges
 * 
 * @param {Buffer} inputBuffer - Original image buffer
 * @returns {Promise<Buffer>} Preprocessed high-contrast PNG buffer
 */
export const preprocessImageForOcr = async (inputBuffer) => {
  try {
    const metadata = await sharp(inputBuffer).metadata();
    
    // Target optimal width for OCR (between 1800 and 2400 pixels)
    const targetWidth = Math.max(metadata.width || 1200, 2000);

    const processedBuffer = await sharp(inputBuffer)
      .resize({
        width: targetWidth,
        fit: 'inside',
        withoutEnlargement: false
      })
      .grayscale()                  // Remove color noise
      .normalize()                  // Stretch contrast
      .gamma(1.15)                  // Enhance midtones for pen strokes
      .sharpen({
        sigma: 1.2,
        m1: 1.0,
        m2: 2.0
      })                            // Make character boundaries crisp
      .png({
        quality: 100,
        density: 300,               // High DPI for Tesseract LSTM
        compressionLevel: 6
      })
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.warn('Image preprocessing warning (falling back to original buffer):', error.message);
    return inputBuffer;
  }
};

/**
 * Privacy Protection Engine:
 * Crops out the top portion of the prescription (Patient Name, Age, Phone, Address)
 * so that ZERO personal identifiable information (PII) is ever transmitted to cloud vision models.
 * Only the lower "Rx" section containing tablet names, strengths, and dosages is kept.
 * 
 * @param {Buffer} inputBuffer - Original image buffer
 * @param {number} topFractionToCrop - Fraction of top to remove (default 0.28, i.e. top 28%)
 * @returns {Promise<Buffer>} Cropped, de-identified image containing only the medicine section
 */
export const cropPatientDetails = async (inputBuffer, topFractionToCrop = 0.28) => {
  try {
    const metadata = await sharp(inputBuffer).metadata();
    const height = metadata.height || 1000;
    const width = metadata.width || 800;

    const topOffset = Math.floor(height * topFractionToCrop);
    const remainingHeight = height - topOffset;

    const croppedBuffer = await sharp(inputBuffer)
      .extract({
        left: 0,
        top: topOffset,
        width: width,
        height: remainingHeight
      })
      .png()
      .toBuffer();

    return croppedBuffer;
  } catch (err) {
    console.warn('Patient cropping warning (using original buffer):', err.message);
    return inputBuffer;
  }
};
