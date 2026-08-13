import { Jimp } from 'jimp';

async function main() {
  try {
    const bg = await Jimp.read('public/screenshot-wide.png');
    bg.cover({ w: 1024, h: 500 });
    await bg.write('public/playstore-feature-graphic.png');
    console.log("Feature graphic created");
  } catch (err) {
    console.error(err);
  }
}

main();
