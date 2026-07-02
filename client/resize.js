import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = path.join(process.cwd(), 'public', 'logos');

const outputDir = path.join(process.cwd(), 'public', 'logos_opt');

async function resizeImages() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.webp'));
  for (const file of files) {
    if (file.startsWith('temp_')) continue;
    
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    try {
      await sharp(inputPath)
        .resize({ width: 256, height: 256, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
        
      console.log(`Resized ${file} to logos_opt`);
    } catch (e) {
      console.error(`Failed to resize ${file}:`, e.message);
    }
  }
}

resizeImages().catch(console.error);
