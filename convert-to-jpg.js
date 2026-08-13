import { Jimp } from 'jimp';
import fs from 'fs';

async function main() {
  try {
    const files = [
      'playstore-feature-graphic',
      'playstore-phone-1',
      'playstore-phone-2',
      'playstore-tablet-1',
      'playstore-tablet-2'
    ];
    
    for (const file of files) {
      const img = await Jimp.read(`public/${file}.png`);
      // Convert to JPG (quality 100) to strip any alpha channel completely
      await img.write(`public/${file}.jpg`);
      
      // Delete the old PNG to avoid confusing the user
      fs.unlinkSync(`public/${file}.png`);
      console.log(`Converted ${file} to JPG`);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
