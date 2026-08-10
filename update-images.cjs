const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/hotels.json', 'utf8'));

const unsplashUrls = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
];

const updated = data.map(hotel => {
  if (hotel.imageUrl) {
    hotel.images = [
      hotel.imageUrl,
      unsplashUrls[Math.floor(Math.random() * unsplashUrls.length)],
      unsplashUrls[Math.floor(Math.random() * unsplashUrls.length)]
    ];
    delete hotel.imageUrl;
  }
  return hotel;
});

fs.writeFileSync('./src/data/hotels.json', JSON.stringify(updated, null, 2));
console.log("hotels.json updated with image arrays!");
