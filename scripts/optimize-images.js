import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  inputDir: path.join(__dirname, '../src/lib/images/originals'),
  outputDir: path.join(__dirname, '../static/images'),
  formats: ['webp', 'avif'], // Add 'jpeg' if you need fallback
  sizes: [
    { width: 640, suffix: '-sm' },
    { width: 768, suffix: '-md' },
    { width: 1024, suffix: '-lg' },
    { width: 1280, suffix: '-xl' },
    { width: 1920, suffix: '-2xl' },
  ],
  quality: 80,
};

async function optimizeImage(inputPath, outputPath, width, format) {
  const transformer = sharp(inputPath).resize(width);
  
  if (format === 'webp') {
    await transformer.webp({ 
      quality: config.quality,
      effort: 6 
    }).toFile(outputPath);
  } else if (format === 'avif') {
    await transformer.avif({ 
      quality: config.quality,
      effort: 6 
    }).toFile(outputPath);
  } else if (format === 'jpeg') {
    await transformer.jpeg({ 
      quality: config.quality,
      mozjpeg: true 
    }).toFile(outputPath);
  }
}

async function processImages() {
  try {
    // Ensure output directory exists
    await fs.mkdir(config.outputDir, { recursive: true });
    
    // Read all files from input directory
    const files = await fs.readdir(config.inputDir);
    
    // Process each file
    for (const file of files) {
      if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
      
      const inputPath = path.join(config.inputDir, file);
      const baseName = path.basename(file, path.extname(file));
      
      console.log(`Processing: ${file}`);
      
      // Process each size and format
      for (const format of config.formats) {
        for (const size of config.sizes) {
          const outputFile = `${baseName}${size.suffix}.${format}`;
          const outputPath = path.join(config.outputDir, outputFile);
          
          await optimizeImage(inputPath, outputPath, size.width, format);
          console.log(`  → Created: ${outputFile} (${size.width}px)`);
        }
        
        // Also create original size
        const outputFile = `${baseName}.${format}`;
        const outputPath = path.join(config.outputDir, outputFile);
        await optimizeImage(inputPath, outputPath, null, format);
        console.log(`  → Created: ${outputFile} (original size)`);
      }
    }
    
    console.log('\n✅ Image optimization complete!');
    console.log(`Output directory: ${config.outputDir}`);
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

processImages();
