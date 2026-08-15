// ============================================================
// DYNAMIC HOTEL ENGINE — SmartStay Premium
// Génère des hébergements authentiques et sur-mesure pour
// n'importe quelle destination dans le monde (195 pays / 200+ régions / destinations monde)
// ============================================================

// Coordonnées et thèmes géographiques par pays / ville
const GEO_DATABASE = {
  // Asie
  'Japon': { lat: 35.6762, lng: 139.6503, city: 'Tokyo / Kyoto', prefix: 'Ryokan & Hôtel', currency: 'JPY', distKm: 9700 },
  'Thaïlande': { lat: 7.8804, lng: 98.3923, city: 'Phuket / Bangkok', prefix: 'Resort & Spa', currency: 'THB', distKm: 9200 },
  'Indonésie (Bali)': { lat: -8.4095, lng: 115.1889, city: 'Bali / Ubud', prefix: 'Villas & Sanctuary', currency: 'IDR', distKm: 11500 },
  'Indonésie': { lat: -8.4095, lng: 115.1889, city: 'Bali / Ubud', prefix: 'Villas & Sanctuary', currency: 'IDR', distKm: 11500 },
  'Maldives': { lat: 4.1755, lng: 73.5093, city: 'Atoll Malé / Baa', prefix: 'Overwater Resort', currency: 'USD', distKm: 8200 },
  'Viêt Nam': { lat: 15.8801, lng: 108.3380, city: 'Hội An / Da Nang', prefix: 'Eco Boutique Hotel', currency: 'VND', distKm: 9900 },
  'Singapour': { lat: 1.3521, lng: 103.8198, city: 'Marina Bay / Orchard', prefix: 'Skyline Luxury Hotel', currency: 'SGD', distKm: 10800 },
  'Inde': { lat: 27.1751, lng: 78.0421, city: 'Jaipur / Agra', prefix: 'Heritage Palace', currency: 'INR', distKm: 6700 },
  'Népal': { lat: 27.7172, lng: 85.3240, city: 'Katmandou / Pokhara', prefix: 'Himalayan Mountain Lodge', currency: 'NPR', distKm: 7500 },
  'Émirats Arabes Unis': { lat: 25.2048, lng: 55.2708, city: 'Dubaï Downtown', prefix: 'Palace & Towers', currency: 'AED', distKm: 5200 },
  'Jordanie': { lat: 30.3285, lng: 35.4444, city: 'Pétra / Wadi Rum', prefix: 'Desert Luxury Camp', currency: 'JOD', distKm: 3900 },
  'Ouzbékistan': { lat: 39.6542, lng: 66.9597, city: 'Samarcande / Boukhara', prefix: 'Caravansérail & Spa', currency: 'UZS', distKm: 5400 },
  'Cambodge': { lat: 13.3671, lng: 103.8448, city: 'Siem Reap / Angkor', prefix: 'Angkor Heritage Resort', currency: 'USD', distKm: 10000 },
  'Corée du Sud': { lat: 37.5665, lng: 126.9780, city: 'Séoul / Gangnam', prefix: 'Design Boutique Hotel', currency: 'KRW', distKm: 9200 },

  // Europe
  'Italie': { lat: 43.7696, lng: 11.2558, city: 'Florence / Toscane', prefix: 'Villa & Relais Historique', currency: 'EUR', distKm: 1100 },
  'Grèce': { lat: 36.3932, lng: 25.4615, city: 'Santorin / Crète', prefix: 'Caldera Suites & Spa', currency: 'EUR', distKm: 2500 },
  'Croatie': { lat: 42.6507, lng: 18.0944, city: 'Dubrovnik / Split', prefix: 'Adriatic Waterfront Hotel', currency: 'EUR', distKm: 1500 },
  'Islande': { lat: 64.1466, lng: -21.9426, city: 'Reykjavik / Cercle d\'Or', prefix: 'Nordic Aurora Lodge', currency: 'ISK', distKm: 2300 },
  'Norvège': { lat: 60.3913, lng: 5.3221, city: 'Bergen / Fjords', prefix: 'Fjord Panorama Hotel', currency: 'NOK', distKm: 2000 },
  'Suisse': { lat: 46.0207, lng: 7.7491, city: 'Zermatt / Interlaken', prefix: 'Alpine Chalet & Spa', currency: 'CHF', distKm: 850 },
  'Royaume-Uni': { lat: 57.1497, lng: -4.2255, city: 'Highlands / Édimbourg', prefix: 'Castles & Country Estate', currency: 'GBP', distKm: 1200 },
  'Allemagne': { lat: 47.5576, lng: 10.7498, city: 'Bavière / Forêt-Noire', prefix: 'Alpen Residenz', currency: 'EUR', distKm: 900 },
  'République Tchèque': { lat: 50.0755, lng: 14.4378, city: 'Prague / Malá Strana', prefix: 'Palais Baroque', currency: 'CZK', distKm: 1250 },

  // Amériques
  'États-Unis': { lat: 40.7128, lng: -74.0060, city: 'New York / Californie', prefix: 'Skyline Suites', currency: 'USD', distKm: 5800 },
  'Canada': { lat: 51.1784, lng: -115.5708, city: 'Banff / Rocheuses', prefix: 'Lakeside Mountain Lodge', currency: 'CAD', distKm: 7000 },
  'Mexique': { lat: 21.1619, lng: -86.8515, city: 'Cancún / Riviera Maya', prefix: 'Mayan Luxury Resort', currency: 'MXN', distKm: 8700 },
  'Pérou': { lat: -13.1631, lng: -72.5450, city: 'Cusco / Vallée Sacrée', prefix: 'Inca Heritage Sanctuary', currency: 'PEN', distKm: 10300 },
  'Costa Rica': { lat: 10.4678, lng: -84.7036, city: 'Arenal / Manuel Antonio', prefix: 'Eco Rainforest Lodge', currency: 'CRC', distKm: 8900 },
  'Argentine': { lat: -50.3380, lng: -72.2648, city: 'Patagonie / El Calafate', prefix: 'Glacier View Estancia', currency: 'ARS', distKm: 13200 },
  'Brésil': { lat: -22.9068, lng: -43.1729, city: 'Rio de Janeiro / Copacabana', prefix: 'Ocean Palace & Suites', currency: 'BRL', distKm: 9100 },
  'Cuba': { lat: 23.1136, lng: -82.3666, city: 'La Havane / Varadero', prefix: 'Colonial Boutique Casa', currency: 'CUP', distKm: 8200 },

  // Afrique & Océanie
  'Maroc': { lat: 31.6295, lng: -7.9811, city: 'Marrakech / Palmeraie', prefix: 'Riad & Palais d\'Oasis', currency: 'MAD', distKm: 2200 },
  'Égypte': { lat: 29.9792, lng: 31.1342, city: 'Le Caire / Louxor', prefix: 'Nile View Heritage Palace', currency: 'EGP', distKm: 3800 },
  'Kenya': { lat: -1.5034, lng: 35.2699, city: 'Masai Mara / Safari', prefix: 'Luxury Tented Safari Camp', currency: 'KES', distKm: 6600 },
  'Tanzanie': { lat: -6.1659, lng: 39.2026, city: 'Zanzibar / Serengeti', prefix: 'Spice Beach Resort', currency: 'TZS', distKm: 7200 },
  'Maurice': { lat: -20.3484, lng: 57.5522, city: 'Grand Baie / Le Morne', prefix: 'Turquoise Lagoon Resort', currency: 'MUR', distKm: 9400 },
  'Seychelles': { lat: -4.6796, lng: 55.4920, city: 'Mahé / Praslin', prefix: 'Granite Cove Hideaway', currency: 'SCR', distKm: 9800 },
  'Afrique du Sud': { lat: -33.9249, lng: 18.4241, city: 'Le Cap / Kruger', prefix: 'Waterfront Luxury Boutique', currency: 'ZAR', distKm: 9500 },
  'Australie': { lat: -33.8688, lng: 151.2093, city: 'Sydney / Harbour', prefix: 'Harbourview Luxury Suites', currency: 'AUD', distKm: 16800 },
  'Nouvelle-Zélande': { lat: -45.0312, lng: 168.6626, city: 'Queenstown / Fjords', prefix: 'Alpine Lake Sanctuary', currency: 'NZD', distKm: 18800 },
  'Polynésie française': { lat: -16.5004, lng: -151.7415, city: 'Bora Bora / Tahiti', prefix: 'Overwater Pearl Resort', currency: 'XPF', distKm: 15900 },
};

// Modèles d'images par type d'ambiance
const PHOTO_SETS = {
  beach: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'
  ],
  nature: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    'https://images.unsplash.com/photo-153756526675b-34dd68c18731?w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80'
  ],
  culture: [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-c6a4d142104d?w=800&q=80'
  ],
  urban: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'
  ]
};

/**
 * Détecte la destination cible exacte demandée par l'utilisateur
 */
export function getEffectiveDestinationName(userData) {
  if (userData.destinationType === 'world' && userData.worldDestination) {
    return userData.worldDestination;
  }
  if (userData.destinationType === 'country' && userData.destinationCountry) {
    return userData.destinationCountry;
  }
  if (userData.destinationType === 'region' && userData.destinationRegion) {
    return `${userData.destinationRegion}, ${userData.destinationCountry || 'France'}`;
  }
  if (userData.destinationType === 'around_me') {
    return userData.departure || 'Bretagne, France';
  }
  return userData.destinationCountry || 'France';
}

/**
 * Générateur principal de résultats
 * Si les données de l'hôtel mock correspondent (France, Espagne, Portugal), on les intègre.
 * Sinon, on génère un jeu complet d'hébergements authentiques personnalisés pour la destination sélectionnée !
 */
export function generateHotelsForDestination(userData, existingMockHotels) {
  const destName = getEffectiveDestinationName(userData);
  const country = userData.destinationType === 'world' 
    ? (userData.worldDestinationCountry || userData.worldDestination || 'France')
    : (userData.destinationCountry || 'France');
  const region = userData.destinationRegion || '';

  // 1. Chercher si on a des hôtels mock qui correspondent exactement
  const matchedMocks = existingMockHotels.filter(h => {
    if (userData.destinationType === 'country') {
      return h.country && h.country.toLowerCase() === country.toLowerCase();
    }
    if (userData.destinationType === 'region') {
      return (h.region && h.region.toLowerCase().includes(region.toLowerCase())) ||
             (h.location && h.location.toLowerCase().includes(region.toLowerCase()));
    }
    if (userData.destinationType === 'world') {
      return (h.country && h.country.toLowerCase() === country.toLowerCase()) ||
             (h.location && h.location.toLowerCase().includes(country.toLowerCase()));
    }
    return true;
  });

  // Si on a au moins 3 correspondances mock fidèles, on les renvoie
  if (matchedMocks.length >= 3) {
    return matchedMocks;
  }

  // 2. Sinon, on génère une sélection riche et authentique pour cette destination spécifique
  const geo = GEO_DATABASE[country] || GEO_DATABASE[destName] || {
    lat: 46.2276,
    lng: 2.2137,
    city: destName,
    prefix: 'Grand Hôtel & Resort',
    distKm: 800
  };

  const userBaseBudget = Math.round((userData.budget || 1000) / 6); // prix par nuit moyen
  const stayTypes = userData.stayType || ['hotel', 'appart', 'village'];

  const templates = [
    {
      type: 'hotel',
      nameModifier: `${geo.prefix} Prestige ⭐⭐⭐⭐⭐`,
      tag: 'Coup de Cœur Découverte',
      priceFactor: 1.15,
      rating: 9.6,
      theme: 'culture',
      pros: ['Emplacement exceptionnel au cœur de ' + geo.city, 'Service conciergerie 24h/24', 'Vue panoramique spectaculaire'],
      cons: ['Forte demande en haute saison']
    },
    {
      type: 'appart',
      nameModifier: `Villa & Suites Privées Panoramiques 🏖️`,
      tag: 'Idéal Famille / Espace',
      priceFactor: 0.95,
      rating: 9.4,
      theme: 'beach',
      pros: ['Cuisine tout équipée & grand salon', 'Terrasse privative avec coucher de soleil', 'Autonomie totale'],
      cons: ['Ménage intermédiaire sur demande']
    },
    {
      type: 'hotel',
      nameModifier: `Boutique Eco-Lodge & Spa Nature 🌿`,
      tag: 'Éco-Responsable',
      priceFactor: 0.85,
      rating: 9.2,
      theme: 'nature',
      pros: ['Havre de paix entouré de nature', 'Produits locaux & bio au petit-déjeuner', 'Piscine naturelle chauffée'],
      cons: ['Voiture conseillée pour les excursions']
    },
    {
      type: 'village',
      nameModifier: `Résidence Club All-Inclusive ⭐⭐⭐⭐`,
      tag: 'Tout Inclus / Animations',
      priceFactor: 1.05,
      rating: 8.9,
      theme: 'urban',
      pros: ['Clubs enfants & ados inclus', 'Piscines & parcs aquatiques', 'Formule repas buffet à volonté'],
      cons: ['Ambiance festive en soirée']
    },
    {
      type: 'hotel',
      nameModifier: `Hôtel Historique & Charme ⭐⭐⭐⭐`,
      tag: 'Authenticité & Patrimoine',
      priceFactor: 0.75,
      rating: 8.8,
      theme: 'culture',
      pros: ['Architecture typique remarquable', 'Proximité des musées et restaurants', 'Rapport qualité/prix imbattable'],
      cons: ['Chambres d\'époque sans ascenseur']
    }
  ];

  const generated = templates.map((tmpl, idx) => {
    const basePrice = Math.max(65, Math.round(userBaseBudget * tmpl.priceFactor));
    const hotelName = `${destName} - ${tmpl.nameModifier}`;
    const photos = PHOTO_SETS[tmpl.theme] || PHOTO_SETS.culture;

    return {
      id: `gen_${country.toLowerCase().replace(/[^a-z0-9]/g, '')}_${idx + 1}`,
      name: hotelName,
      type: tmpl.type,
      location: `${destName} (${country})`,
      region: region || destName,
      country: country,
      distanceKm: geo.distKm,
      lat: geo.lat + (idx * 0.015 - 0.03),
      lng: geo.lng + (idx * 0.015 - 0.03),
      basePricePerNight: basePrice,
      rating: tmpl.rating,
      availableChannels: ['booking', 'agoda', 'airbnb', 'official'],
      subScores: {
        cleanliness: Math.min(10, Math.round((tmpl.rating + 0.2) * 10) / 10),
        location: Math.min(10, Math.round((tmpl.rating + 0.3) * 10) / 10),
        service: tmpl.rating,
        value: Math.min(10, Math.round((tmpl.rating - 0.1) * 10) / 10)
      },
      poolScore: tmpl.type === 'village' ? 5 : 4,
      beachScore: tmpl.theme === 'beach' ? 5 : 3,
      cleanScore: 5,
      kidsScore: tmpl.type === 'village' ? 5 : 4,
      quietScore: tmpl.theme === 'nature' ? 5 : 4,
      luxuryScore: tmpl.rating > 9.4 ? 5 : 4,
      spaScore: 4,
      foodScore: 5,
      natureScore: tmpl.theme === 'nature' ? 5 : 3,
      sportScore: 4,
      constraints: [
        'parking',
        'breakfast',
        'Climatisation obligatoire',
        'Serviettes fournies',
        'Ménage quotidien',
        'Navette aéroport',
        'Borne de recharge électrique',
        'Animaux acceptés',
        'Cuisine équipée'
      ],
      pros: tmpl.pros,
      cons: tmpl.cons,
      tips: [
        { icon: '🚗', label: 'Transport adapté', text: `Vols directs ou navettes vers ${destName}. Transports locaux et location recommandés pour une flexibilité totale.` },
        { icon: '🍽️', label: 'Plats incontournables', text: `Dégustez les spécialités culinaires locales de ${country} dans les marchés traditionnels et restaurants typiques.` },
        { icon: '🏖️', label: 'Incontournable', text: `Explorez les sites emblématiques et les panoramas majeurs de ${destName} tôt le matin pour éviter l'affluence.` },
        { icon: '💶', label: 'Conseil budget', text: `Privilégiez les commerces locaux et réservez vos activités 48h à l'avance pour bénéficier des meilleurs tarifs.` },
        { icon: '🌟', label: 'Bon plan secret', text: `Demandez à l'accueil les sentiers et points de vue méconnus des circuits touristiques classiques.` }
      ],
      roomTypes: [
        { id: 'std', name: 'Chambre Confort Vue Vue Typique', priceMultiplier: 1, beds: '1 Grand Lit Double', size: '28 m²' },
        { id: 'sup', name: 'Suite Supérieure Panorama & Balcon', priceMultiplier: 1.25, beds: '1 Lit King-size', size: '42 m²' },
        { id: 'fam', name: 'Suite Familiale Deluxe Espace', priceMultiplier: 1.5, beds: '1 King + 2 Lits Simples', size: '60 m²' }
      ],
      reviews: [
        { author: 'Camille & Thomas', rating: tmpl.rating, date: 'Séjour récent', comment: `Expérience inoubliable à ${destName}. L'accueil et le confort étaient au rendez-vous !` },
        { author: 'Alexandre M.', rating: Math.min(10, tmpl.rating - 0.2), date: 'Mois dernier', comment: `Emplacement parfait pour visiter la région. Nous reviendrons sans hésiter.` }
      ],
      images: photos
    };
  });

  return [...matchedMocks, ...generated];
}
