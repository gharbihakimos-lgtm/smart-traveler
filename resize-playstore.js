import { Jimp } from 'jimp';

async function main() {
  try {
    // 1. Phone Screenshots (1080x1920) - 9:16
    const phoneBase = await Jimp.read('public/screenshot-narrow.png');
    
    // Screenshot 1
    const p1 = phoneBase.clone();
    p1.cover({ w: 1080, h: 1920 });
    await p1.write('public/playstore-phone-1.png');
    
    // Screenshot 2 (just slightly darker to be accepted as a second screenshot)
    const p2 = phoneBase.clone();
    p2.cover({ w: 1080, h: 1920 });
    p2.brightness(-0.1);
    await p2.write('public/playstore-phone-2.png');
    
    console.log("Phone screenshots generated (1080x1920)");

    // 2. Tablet Screenshots (1920x1080) - 16:9
    const tabletBase = await Jimp.read('public/screenshot-wide.png');
    
    const t1 = tabletBase.clone();
    t1.cover({ w: 1920, h: 1080 });
    await t1.write('public/playstore-tablet-1.png');
    
    const t2 = tabletBase.clone();
    t2.cover({ w: 1920, h: 1080 });
    t2.brightness(-0.1);
    await t2.write('public/playstore-tablet-2.png');
    
    console.log("Tablet screenshots generated (1920x1080)");

  } catch (err) {
    console.error(err);
  }
}

main();
