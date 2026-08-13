import { Jimp } from 'jimp';

async function main() {
  try {
    const brainDir = 'C:\\Users\\hakim\\.gemini\\antigravity\\brain\\3a30262b-e058-4ed9-928d-ec8e5e53af42\\';
    
    // Feature Graphic -> 1024x500
    const fg = await Jimp.read(brainDir + 'feature_graphic_v2_1786530904719.jpg');
    fg.cover({ w: 1024, h: 500 });
    await fg.write('public/playstore-feature-graphic.png');
    console.log("Feature graphic done");
    
    // Phone 1 -> 1080x1920
    const p1 = await Jimp.read(brainDir + 'phone_1_v2_1786530914333.jpg');
    p1.cover({ w: 1080, h: 1920 });
    await p1.write('public/playstore-phone-1.png');
    console.log("Phone 1 done");
    
    // Phone 2 -> 1080x1920
    const p2 = await Jimp.read(brainDir + 'phone_2_v2_1786530922697.jpg');
    p2.cover({ w: 1080, h: 1920 });
    await p2.write('public/playstore-phone-2.png');
    console.log("Phone 2 done");
    
    // Tablet 1 -> 1920x1080
    const t1 = await Jimp.read(brainDir + 'tablet_1_v2_1786530934172.jpg');
    t1.cover({ w: 1920, h: 1080 });
    await t1.write('public/playstore-tablet-1.png');
    console.log("Tablet 1 done");
    
    // Tablet 2 -> 1920x1080
    const t2 = await Jimp.read(brainDir + 'tablet_2_v2_1786530945780.jpg');
    t2.cover({ w: 1920, h: 1080 });
    await t2.write('public/playstore-tablet-2.png');
    console.log("Tablet 2 done");
    
    console.log("All beautiful AI photos saved!");
  } catch (err) {
    console.error(err);
  }
}
main();
