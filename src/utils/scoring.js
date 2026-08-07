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
    // 0. Filter by Destination
    if (userData.destinationType === 'around_me') {
      if (hotel.distanceKm > userData.distanceMax) return { ...hotel, score: 0 };
    } else if (userData.destinationType === 'country') {
      if (hotel.country !== userData.destinationCountry) return { ...hotel, score: 0 };
    } else if (userData.destinationType === 'region') {
      if (hotel.region !== userData.destinationRegion) return { ...hotel, score: 0 };
    }
    // "world" means no geographic filter

    // 1. Filter by stay type
    if (!userData.stayType.includes(hotel.type)) {
      return { ...hotel, score: 0, failReason: 'Type de séjour non souhaité' };
    }

    // 2. Check Constraints (Mandatory)
    const missingConstraints = userData.constraints.filter(c => !hotel.constraints.includes(c));
    if (missingConstraints.length > 0) {
      return { ...hotel, score: 0, failReason: `Il manque: ${missingConstraints.join(', ')}` };
    }

    // 3. Price Calculation
    const rooms = userData.sameRoom ? 1 : 2;
    const accommodationPrice = hotel.basePricePerNight * nights * rooms;
    
    // If distance is explicitly known, refine transport cost
    const refinedTransport = (hotel.distanceKm * 0.2) * rooms; // e.g., 0.2€ per km per room
    const totalPrice = accommodationPrice + refinedTransport;

    if (totalPrice > budgetMax) {
      return { ...hotel, score: 0, failReason: `Hors budget (${Math.round(totalPrice)}€)` };
    }

    // 4. Score Calculation
    let score = 0;
    
    // Quality (Up to 30 points)
    score += hotel.rating * 3; 

    // Budget Affinity (Up to 20 points)
    const budgetDiff = budgetMax - totalPrice;
    const budgetScore = Math.min(20, (budgetDiff / budgetMax) * 40); 
    score += budgetScore;

    // Dynamic Priority matching (Max ~50 points)
    // Map of user priority keys to hotel score keys
    const priorityMapping = {
      pool: 'poolScore',
      beach: 'beachScore',
      clean: 'cleanScore',
      kids: 'kidsScore',
      quiet: 'quietScore',
      luxury: 'luxuryScore',
      spa: 'spaScore',
      food: 'foodScore',
      nature: 'natureScore',
      sport: 'sportScore'
    };

    const axesCount = Object.keys(userData.priorities).length || 6;
    const maxPointsPerAxis = 50 / axesCount;

    Object.keys(userData.priorities).forEach(key => {
      const hKey = priorityMapping[key];
      const uVal = userData.priorities[key]; // 1 to 5
      const hVal = hotel[hKey] || 3; // 1 to 5, default to average if missing
      
      const match = (uVal * hVal) / 5; // scales 1 to 5
      score += match * (maxPointsPerAxis / 5); 
    });

    // Generate dynamic "Why" text
    let why = `J'ai choisi ce logement car `;
    if (userData.destinationType === 'around_me') why += `il est proche de chez vous (${hotel.distanceKm} km), `;
    if (userData.children > 0 && hotel.kidsScore >= 4) why += `il est parfaitement adapté aux enfants, `;
    if (userData.priorities.spa >= 4 && hotel.spaScore >= 4) why += `son espace bien-être est excellent, `;
    if (totalPrice < userData.budget * 0.8) why += `et il vous permet de faire de belles économies par rapport à votre budget.`;
    else why += `et il rentre dans votre budget de ${userData.budget}€.`;

    score = Math.min(99, Math.round(score));

    return {
      ...hotel,
      score,
      totalPrice: Math.round(totalPrice),
      nights,
      why
    };
  });

  const validHotels = scoredHotels.filter(h => h.score > 0).sort((a, b) => b.score - a.score);
  return validHotels;
};
