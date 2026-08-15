function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2-lat1) * (Math.PI/180);
  const dLon = (lon2-lon1) * (Math.PI/180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return Math.round(R * c);
}

export const calculateScores = (userData, hotelsData) => {
  // Calculate nights
  const start = new Date(userData.dateStart);
  const end = new Date(userData.dateEnd);
  const diffTime = Math.abs(end - start);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  
  // Base transport cost estimation
  let transportCostPerPerson = 50;
  if (userData.departure === 'Paris') transportCostPerPerson = 80;
  if (userData.departure === 'Rennes' || userData.departure === 'Nantes') transportCostPerPerson = 60;
  
  const totalTransport = transportCostPerPerson * (userData.adults + (userData.children * 0.5));
  const budgetMax = userData.budgetFlexible ? userData.budget * 1.1 : userData.budget;

  const scoredHotels = hotelsData.map(hotel => {
    let baseScore = 0;
    const warnings = [];

    // True distance override
    let hotelDistance = hotel.distanceKm;
    if (userData.lat && userData.lng && hotel.lat && hotel.lng) {
      const d = getDistanceFromLatLonInKm(userData.lat, userData.lng, hotel.lat, hotel.lng);
      if (d !== null) hotelDistance = d;
    }

    // 0. Destination Check
    if (userData.destinationType === 'around_me' && hotelDistance > userData.distanceMax) {
      warnings.push(`Trop loin (${hotelDistance} km, max ${userData.distanceMax} km)`);
    } else if (userData.destinationType === 'country') {
      if (userData.destinationCountry && hotel.country && !hotel.country.toLowerCase().includes(userData.destinationCountry.toLowerCase()) && !userData.destinationCountry.toLowerCase().includes(hotel.country.toLowerCase())) {
        warnings.push(`Situé en ${hotel.country} (Vous vouliez : ${userData.destinationCountry})`);
      }
    } else if (userData.destinationType === 'region') {
      if (userData.destinationRegion && hotel.region && !hotel.region.toLowerCase().includes(userData.destinationRegion.toLowerCase()) && !userData.destinationRegion.toLowerCase().includes(hotel.region.toLowerCase())) {
        warnings.push(`Situé en ${hotel.region} (Vous vouliez : ${userData.destinationRegion})`);
      }
    } else if (userData.destinationType === 'world' && userData.worldDestinationCountry) {
      if (hotel.country && !hotel.country.toLowerCase().includes(userData.worldDestinationCountry.toLowerCase())) {
        // Soft match or keep without harsh penalty
      }
    }

    // 1. Stay Type Check
    if (!userData.stayType.includes(hotel.type)) {
      let typeName = hotel.type === 'appart' ? 'Appartement' : hotel.type === 'village' ? 'Village vacances' : hotel.type;
      warnings.push(`Type de logement différent (C'est un(e) ${typeName})`);
    }

    // 2. Constraints Check
    const missingConstraints = userData.constraints.filter(c => !hotel.constraints.includes(c));
    if (missingConstraints.length > 0) {
      warnings.push(`Critère(s) manquant(s) : ${missingConstraints.join(', ')}`);
    }

    // 3. Price Calculation
    const rooms = userData.sameRoom ? 1 : 2;
    const accommodationPrice = hotel.basePricePerNight * nights * rooms;
    const refinedTransport = (hotelDistance * 0.2) * rooms;
    const totalPrice = accommodationPrice + refinedTransport;

    if (totalPrice > budgetMax) {
      warnings.push(`Dépasse votre budget de ${Math.round(totalPrice - budgetMax)}€`);
    }

    // 4. Positive Score Calculation (max ~100)
    baseScore += hotel.rating * 3; // Up to 30

    const budgetDiff = budgetMax - totalPrice;
    let budgetScore = 0;
    if (budgetDiff >= 0) {
      budgetScore = Math.min(20, (budgetDiff / budgetMax) * 40);
    }
    baseScore += budgetScore; // Up to 20

    const priorityMapping = {
      pool: 'poolScore', beach: 'beachScore', clean: 'cleanScore',
      kids: 'kidsScore', quiet: 'quietScore', luxury: 'luxuryScore',
      spa: 'spaScore', food: 'foodScore', nature: 'natureScore', sport: 'sportScore'
    };

    const axesCount = Object.keys(userData.priorities).length || 6;
    const maxPointsPerAxis = 50 / axesCount;

    Object.keys(userData.priorities).forEach(key => {
      const hKey = priorityMapping[key];
      const uVal = userData.priorities[key]; 
      const hVal = hotel[hKey] || 3; 
      const match = (uVal * hVal) / 5; 
      baseScore += match * (maxPointsPerAxis / 5); 
    });

    // 5. Apply Penalties for Warnings
    let finalScore = Math.round(baseScore);
    if (warnings.length > 0) {
      finalScore -= (warnings.length * 20); // -20 points per warning
    }
    
    finalScore = Math.max(10, Math.min(99, finalScore)); // Score entre 10 et 99

    let why = `J'ai sélectionné ce logement car `;
    if (warnings.length === 0) {
      why += `il correspond parfaitement à 100% de vos critères stricts ! `;
    } else {
      why += `c'est l'une des meilleures alternatives disponibles malgré quelques compromis. `;
    }
    if (userData.children > 0 && hotel.kidsScore >= 4) why += `Il est idéal pour les familles. `;
    if (totalPrice <= userData.budget) why += `Et surtout, il rentre dans votre budget !`;

    return {
      ...hotel,
      distanceKm: hotelDistance,
      score: finalScore,
      totalPrice: Math.round(totalPrice),
      nights,
      why,
      warnings
    };
  });

  return scoredHotels.sort((a, b) => b.score - a.score);
};
