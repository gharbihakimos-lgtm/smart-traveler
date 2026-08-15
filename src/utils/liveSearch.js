// ============================================================
// LIVE SEARCH URL BUILDER — SmartStay Premium
// Génère des liens pré-remplis pour les moteurs de recherche
// réels : Google Hotels, Booking.com, Airbnb, Kayak, Expedia, TripAdvisor
// ============================================================

/**
 * Formate une date JS en "YYYY-MM-DD" pour les APIs
 */
function formatDate(dateStr) {
  if (!dateStr) {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }
  return dateStr;
}

/**
 * Formate une date en "DD/MM/YYYY" pour certaines platforms
 */
function formatDateEU(dateStr) {
  const [y, m, d] = formatDate(dateStr).split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Décompresse la destination pour les URLs
 */
function encodeDest(dest) {
  return encodeURIComponent(dest || 'France');
}

// ── GOOGLE HOTELS ──
export function getGoogleHotelsUrl({ destination, dateStart, dateEnd, adults = 2, children = 0, budget }) {
  const dest = encodeDest(destination);
  const checkin = formatDate(dateStart);
  const checkout = formatDate(dateEnd);
  // Google Hotels URL format
  const params = new URLSearchParams({
    q: `hotels ${destination}`,
    hl: 'fr',
    gl: 'fr',
    checkin,
    checkout,
    adults: String(adults),
    ...(children > 0 ? { children: String(children) } : {}),
    ...(budget ? { price_max: String(Math.round(budget / 5)) } : {}),
  });
  return `https://www.google.com/travel/hotels/${dest}?${params.toString()}`;
}

// ── BOOKING.COM ──
export function getBookingUrl({ destination, dateStart, dateEnd, adults = 2, children = 0, rooms = 1 }) {
  const checkin = formatDate(dateStart);
  const checkout = formatDate(dateEnd);
  const params = new URLSearchParams({
    ss: destination || 'France',
    checkin,
    checkout,
    group_adults: String(adults),
    group_children: String(children),
    no_rooms: String(rooms),
    lang: 'fr',
    selected_currency: 'EUR',
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

// ── AIRBNB ──
export function getAirbnbUrl({ destination, dateStart, dateEnd, adults = 2, children = 0 }) {
  const checkin = formatDate(dateStart);
  const checkout = formatDate(dateEnd);
  const params = new URLSearchParams({
    query: destination || 'France',
    checkin,
    checkout,
    adults: String(adults),
    children: String(children),
    locale: 'fr',
    currency: 'EUR',
  });
  return `https://www.airbnb.fr/s/${encodeDest(destination)}/homes?${params.toString()}`;
}

// ── KAYAK ──
export function getKayakUrl({ destination, dateStart, dateEnd, adults = 2, children = 0, budget }) {
  const cin = formatDate(dateStart).replace(/-/g, '');
  const cout = formatDate(dateEnd).replace(/-/g, '');
  const dest = (destination || 'france').toLowerCase().replace(/\s+/g, '-').replace(/[àâ]/g, 'a').replace(/[éèê]/g, 'e').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u');
  const guests = `${adults}adults${children > 0 ? `,${children}children` : ''}`;
  return `https://www.kayak.fr/hotels/${dest}/${cin}-${cout}/${guests}`;
}

// ── EXPEDIA ──
export function getExpediaUrl({ destination, dateStart, dateEnd, adults = 2, children = 0 }) {
  const params = new URLSearchParams({
    destination: destination || 'France',
    startDate: formatDate(dateStart),
    endDate: formatDate(dateEnd),
    adults: String(adults),
    children: String(children),
    sort: 'RECOMMENDED',
    locale: 'fr_FR',
    currency: 'EUR',
  });
  return `https://www.expedia.fr/Hotel-Search?${params.toString()}`;
}

// ── TRIPADVISOR ──
export function getTripAdvisorUrl({ destination, dateStart, dateEnd, adults = 2 }) {
  const checkin = formatDate(dateStart);
  const checkout = formatDate(dateEnd);
  const params = new URLSearchParams({
    q: destination || 'France',
    checkin,
    checkout,
    adults: String(adults),
    currency: 'EUR',
  });
  return `https://www.tripadvisor.fr/Hotels?${params.toString()}`;
}

// ── HOTELS.COM ──
export function getHotelsComUrl({ destination, dateStart, dateEnd, adults = 2, children = 0 }) {
  const params = new URLSearchParams({
    destination: destination || 'France',
    'q-check-in': formatDate(dateStart),
    'q-check-out': formatDate(dateEnd),
    'q-rooms': '1',
    'q-room-0-adults': String(adults),
    ...(children > 0 ? { 'q-room-0-children': String(children) } : {}),
    locale: 'fr_FR',
    currency: 'EUR',
  });
  return `https://fr.hotels.com/Hotel-Search?${params.toString()}`;
}

// ── AGODA ──
export function getAgodaUrl({ destination, dateStart, dateEnd, adults = 2, children = 0 }) {
  const params = new URLSearchParams({
    city: destination || 'France',
    checkIn: formatDate(dateStart),
    checkOut: formatDate(dateEnd),
    adults: String(adults),
    children: String(children),
    los: '1',
    currency: 'EUR',
    locale: 'fr-fr',
  });
  return `https://www.agoda.com/fr-fr/search?${params.toString()}`;
}

// ── Objet complet avec tous les liens ──
export function getAllSearchLinks(searchParams) {
  const { destination, dateStart, dateEnd, adults, children, budget, sameRoom } = searchParams;
  const rooms = sameRoom ? 1 : Math.ceil((adults + children * 0.5) / 2);

  return [
    {
      platform: 'Google Hotels',
      logo: '🔍',
      color: '#4285F4',
      url: getGoogleHotelsUrl({ destination, dateStart, dateEnd, adults, children, budget }),
      desc: 'Le meilleur moteur — compare toutes les plateformes',
      recommended: true,
    },
    {
      platform: 'Booking.com',
      logo: '🏨',
      color: '#003B95',
      url: getBookingUrl({ destination, dateStart, dateEnd, adults, children, rooms }),
      desc: 'Leader mondial — plus de 28 millions d\'hébergements',
      recommended: true,
    },
    {
      platform: 'Airbnb',
      logo: '🏠',
      color: '#FF5A5F',
      url: getAirbnbUrl({ destination, dateStart, dateEnd, adults, children }),
      desc: 'Locations uniques — appartements, villas, maisons',
      recommended: false,
    },
    {
      platform: 'Kayak',
      logo: '🚀',
      color: '#FF690F',
      url: getKayakUrl({ destination, dateStart, dateEnd, adults, children, budget }),
      desc: 'Compare les prix de 200+ sites de voyage',
      recommended: false,
    },
    {
      platform: 'Expedia',
      logo: '✈️',
      color: '#003580',
      url: getExpediaUrl({ destination, dateStart, dateEnd, adults, children }),
      desc: 'Hôtel + Vol groupé pour économiser encore plus',
      recommended: false,
    },
    {
      platform: 'TripAdvisor',
      logo: '⭐',
      color: '#34E0A1',
      url: getTripAdvisorUrl({ destination, dateStart, dateEnd, adults }),
      desc: 'Avis authentiques + comparaison prix en temps réel',
      recommended: false,
    },
    {
      platform: 'Hotels.com',
      logo: '🏩',
      color: '#D92B3A',
      url: getHotelsComUrl({ destination, dateStart, dateEnd, adults, children }),
      desc: '1 nuit gratuite offerte toutes les 10 nuits',
      recommended: false,
    },
    {
      platform: 'Agoda',
      logo: '🌏',
      color: '#5392FF',
      url: getAgodaUrl({ destination, dateStart, dateEnd, adults, children }),
      desc: 'Expert Asie & Pacifique — prix imbattables',
      recommended: false,
    },
  ];
}
