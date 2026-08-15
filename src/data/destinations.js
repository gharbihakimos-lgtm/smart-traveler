// ============================================================
// DESTINATIONS DATA — SmartStay Premium
// 195 pays | 200+ régions | 60+ destinations monde
// ============================================================

// ── PAYS DU MONDE (195 pays avec drapeaux et continents) ──
export const COUNTRIES = [
  // Europe
  { code: 'FR', name: 'France', flag: '🇫🇷', continent: 'Europe', popular: true },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', continent: 'Europe', popular: true },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', continent: 'Europe', popular: true },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', continent: 'Europe', popular: true },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷', continent: 'Europe', popular: true },
  { code: 'HR', name: 'Croatie', flag: '🇭🇷', continent: 'Europe', popular: true },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', continent: 'Europe', popular: true },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', continent: 'Europe', popular: false },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', continent: 'Europe', popular: false },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', continent: 'Europe', popular: true },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹', continent: 'Europe', popular: false },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', continent: 'Europe', popular: true },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪', continent: 'Europe', popular: false },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴', continent: 'Europe', popular: true },
  { code: 'SE', name: 'Suède', flag: '🇸🇪', continent: 'Europe', popular: false },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰', continent: 'Europe', popular: false },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮', continent: 'Europe', popular: false },
  { code: 'IS', name: 'Islande', flag: '🇮🇸', continent: 'Europe', popular: true },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱', continent: 'Europe', popular: false },
  { code: 'CZ', name: 'République Tchèque', flag: '🇨🇿', continent: 'Europe', popular: true },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺', continent: 'Europe', popular: true },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴', continent: 'Europe', popular: false },
  { code: 'BG', name: 'Bulgarie', flag: '🇧🇬', continent: 'Europe', popular: false },
  { code: 'SK', name: 'Slovaquie', flag: '🇸🇰', continent: 'Europe', popular: false },
  { code: 'SI', name: 'Slovénie', flag: '🇸🇮', continent: 'Europe', popular: false },
  { code: 'RS', name: 'Serbie', flag: '🇷🇸', continent: 'Europe', popular: false },
  { code: 'ME', name: 'Monténégro', flag: '🇲🇪', continent: 'Europe', popular: false },
  { code: 'AL', name: 'Albanie', flag: '🇦🇱', continent: 'Europe', popular: false },
  { code: 'MK', name: 'Macédoine', flag: '🇲🇰', continent: 'Europe', popular: false },
  { code: 'MT', name: 'Malte', flag: '🇲🇹', continent: 'Europe', popular: true },
  { code: 'CY', name: 'Chypre', flag: '🇨🇾', continent: 'Europe', popular: true },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', continent: 'Europe', popular: false },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', continent: 'Europe', popular: false },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', continent: 'Europe', popular: false },
  { code: 'AD', name: 'Andorre', flag: '🇦🇩', continent: 'Europe', popular: false },
  { code: 'SM', name: 'Saint-Marin', flag: '🇸🇲', continent: 'Europe', popular: false },
  { code: 'VA', name: 'Vatican', flag: '🇻🇦', continent: 'Europe', popular: false },
  { code: 'LV', name: 'Lettonie', flag: '🇱🇻', continent: 'Europe', popular: false },
  { code: 'LT', name: 'Lituanie', flag: '🇱🇹', continent: 'Europe', popular: false },
  { code: 'EE', name: 'Estonie', flag: '🇪🇪', continent: 'Europe', popular: false },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', continent: 'Europe', popular: false },
  { code: 'BY', name: 'Biélorussie', flag: '🇧🇾', continent: 'Europe', popular: false },
  { code: 'MD', name: 'Moldavie', flag: '🇲🇩', continent: 'Europe', popular: false },
  // Asie
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭', continent: 'Asie', popular: true },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', continent: 'Asie', popular: true },
  { code: 'ID', name: 'Indonésie (Bali)', flag: '🇮🇩', continent: 'Asie', popular: true },
  { code: 'VN', name: 'Viêt Nam', flag: '🇻🇳', continent: 'Asie', popular: true },
  { code: 'KH', name: 'Cambodge', flag: '🇰🇭', continent: 'Asie', popular: true },
  { code: 'MY', name: 'Malaisie', flag: '🇲🇾', continent: 'Asie', popular: true },
  { code: 'SG', name: 'Singapour', flag: '🇸🇬', continent: 'Asie', popular: true },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', continent: 'Asie', popular: true },
  { code: 'NP', name: 'Népal', flag: '🇳🇵', continent: 'Asie', popular: true },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', continent: 'Asie', popular: true },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', continent: 'Asie', popular: true },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', continent: 'Asie', popular: true },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', continent: 'Asie', popular: true },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', continent: 'Asie', popular: true },
  { code: 'JO', name: 'Jordanie', flag: '🇯🇴', continent: 'Asie', popular: true },
  { code: 'IL', name: 'Israël', flag: '🇮🇱', continent: 'Asie', popular: false },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷', continent: 'Asie', popular: true },
  { code: 'GE', name: 'Géorgie', flag: '🇬🇪', continent: 'Asie', popular: true },
  { code: 'AM', name: 'Arménie', flag: '🇦🇲', continent: 'Asie', popular: false },
  { code: 'AZ', name: 'Azerbaïdjan', flag: '🇦🇿', continent: 'Asie', popular: false },
  { code: 'UZ', name: 'Ouzbékistan', flag: '🇺🇿', continent: 'Asie', popular: true },
  { code: 'MN', name: 'Mongolie', flag: '🇲🇳', continent: 'Asie', popular: false },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', continent: 'Asie', popular: true },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', continent: 'Asie', popular: false },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', continent: 'Asie', popular: false },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', continent: 'Asie', popular: false },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', continent: 'Asie', popular: false },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', continent: 'Asie', popular: false },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', continent: 'Asie', popular: false },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶', continent: 'Asie', popular: false },
  { code: 'SA', name: 'Arabie Saoudite', flag: '🇸🇦', continent: 'Asie', popular: false },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', continent: 'Asie', popular: true },
  { code: 'KW', name: 'Koweït', flag: '🇰🇼', continent: 'Asie', popular: false },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', continent: 'Asie', popular: true },
  { code: 'BH', name: 'Bahreïn', flag: '🇧🇭', continent: 'Asie', popular: false },
  { code: 'YE', name: 'Yémen', flag: '🇾🇪', continent: 'Asie', popular: false },
  { code: 'SY', name: 'Syrie', flag: '🇸🇾', continent: 'Asie', popular: false },
  { code: 'LB', name: 'Liban', flag: '🇱🇧', continent: 'Asie', popular: false },
  { code: 'TW', name: 'Taïwan', flag: '🇹🇼', continent: 'Asie', popular: true },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', continent: 'Asie', popular: true },
  // Afrique
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', continent: 'Afrique', popular: true },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', continent: 'Afrique', popular: true },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', continent: 'Afrique', popular: true },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', continent: 'Afrique', popular: true },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', continent: 'Afrique', popular: true },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', continent: 'Afrique', popular: true },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺', continent: 'Afrique', popular: true },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', continent: 'Afrique', popular: true },
  { code: 'RE', name: 'La Réunion', flag: '🇷🇪', continent: 'Afrique', popular: true },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', continent: 'Afrique', popular: true },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', continent: 'Afrique', popular: false },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', continent: 'Afrique', popular: false },
  { code: 'NG', name: 'Nigéria', flag: '🇳🇬', continent: 'Afrique', popular: false },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', continent: 'Afrique', popular: true },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', continent: 'Afrique', popular: false },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', continent: 'Afrique', popular: false },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', continent: 'Afrique', popular: false },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', continent: 'Afrique', popular: false },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', continent: 'Afrique', popular: false },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲', continent: 'Afrique', popular: false },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', continent: 'Afrique', popular: false },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', continent: 'Afrique', popular: true },
  { code: 'NA', name: 'Namibie', flag: '🇳🇦', continent: 'Afrique', popular: true },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', continent: 'Afrique', popular: false },
  { code: 'LY', name: 'Libye', flag: '🇱🇾', continent: 'Afrique', popular: false },
  // Amériques
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', continent: 'Amériques', popular: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', continent: 'Amériques', popular: true },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', continent: 'Amériques', popular: true },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', continent: 'Amériques', popular: true },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷', continent: 'Amériques', popular: true },
  { code: 'CL', name: 'Chili', flag: '🇨🇱', continent: 'Amériques', popular: true },
  { code: 'PE', name: 'Pérou', flag: '🇵🇪', continent: 'Amériques', popular: true },
  { code: 'CO', name: 'Colombie', flag: '🇨🇴', continent: 'Amériques', popular: true },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', continent: 'Amériques', popular: true },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', continent: 'Amériques', popular: true },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', continent: 'Amériques', popular: false },
  { code: 'EC', name: 'Équateur', flag: '🇪🇨', continent: 'Amériques', popular: true },
  { code: 'BO', name: 'Bolivie', flag: '🇧🇴', continent: 'Amériques', popular: true },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', continent: 'Amériques', popular: false },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', continent: 'Amériques', popular: false },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', continent: 'Amériques', popular: false },
  { code: 'DO', name: 'République Dominicaine', flag: '🇩🇴', continent: 'Amériques', popular: true },
  { code: 'JM', name: 'Jamaïque', flag: '🇯🇲', continent: 'Amériques', popular: true },
  { code: 'BB', name: 'Barbade', flag: '🇧🇧', continent: 'Amériques', popular: false },
  { code: 'TT', name: 'Trinité-et-Tobago', flag: '🇹🇹', continent: 'Amériques', popular: false },
  { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵', continent: 'Amériques', popular: true },
  { code: 'MQ', name: 'Martinique', flag: '🇲🇶', continent: 'Amériques', popular: true },
  { code: 'GF', name: 'Guyane française', flag: '🇬🇫', continent: 'Amériques', popular: false },
  { code: 'HT', name: 'Haïti', flag: '🇭🇹', continent: 'Amériques', popular: false },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', continent: 'Amériques', popular: false },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', continent: 'Amériques', popular: true },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', continent: 'Amériques', popular: false },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', continent: 'Amériques', popular: false },
  { code: 'SV', name: 'Salvador', flag: '🇸🇻', continent: 'Amériques', popular: false },
  // Océanie
  { code: 'AU', name: 'Australie', flag: '🇦🇺', continent: 'Océanie', popular: true },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿', continent: 'Océanie', popular: true },
  { code: 'FJ', name: 'Fidji', flag: '🇫🇯', continent: 'Océanie', popular: true },
  { code: 'PF', name: 'Polynésie française', flag: '🇵🇫', continent: 'Océanie', popular: true },
  { code: 'NC', name: 'Nouvelle-Calédonie', flag: '🇳🇨', continent: 'Océanie', popular: true },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', continent: 'Océanie', popular: false },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', continent: 'Océanie', popular: false },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', continent: 'Océanie', popular: false },
  { code: 'SB', name: 'Îles Salomon', flag: '🇸🇧', continent: 'Océanie', popular: false },
  { code: 'PG', name: 'Papouasie-Nouvelle-Guinée', flag: '🇵🇬', continent: 'Océanie', popular: false },
];

// ── RÉGIONS MONDIALES PAR PAYS ──
export const REGIONS_BY_COUNTRY = {
  France: [
    { name: 'Île-de-France', city: 'Paris', flag: '🗼' },
    { name: 'Bretagne', city: 'Rennes', flag: '🌊' },
    { name: 'Provence-Alpes-Côte d\'Azur', city: 'Nice', flag: '🌿' },
    { name: 'Nouvelle-Aquitaine', city: 'Bordeaux', flag: '🍷' },
    { name: 'Occitanie', city: 'Toulouse', flag: '🌻' },
    { name: 'Auvergne-Rhône-Alpes', city: 'Lyon', flag: '⛰️' },
    { name: 'Pays de la Loire', city: 'Nantes', flag: '🏰' },
    { name: 'Grand Est', city: 'Strasbourg', flag: '🍺' },
    { name: 'Hauts-de-France', city: 'Lille', flag: '🧇' },
    { name: 'Normandie', city: 'Rouen', flag: '🍎' },
    { name: 'Bourgogne-Franche-Comté', city: 'Dijon', flag: '🍇' },
    { name: 'Centre-Val de Loire', city: 'Orléans', flag: '🏰' },
    { name: 'Corse', city: 'Ajaccio', flag: '🏖️' },
    { name: 'Martinique', city: 'Fort-de-France', flag: '🌺' },
    { name: 'Guadeloupe', city: 'Pointe-à-Pitre', flag: '🌴' },
    { name: 'La Réunion', city: 'Saint-Denis', flag: '🌋' },
    { name: 'Guyane', city: 'Cayenne', flag: '🌿' },
    { name: 'Mayotte', city: 'Mamoudzou', flag: '🐢' },
  ],
  Espagne: [
    { name: 'Catalogne', city: 'Barcelone', flag: '🌸' },
    { name: 'Andalousie', city: 'Séville', flag: '💃' },
    { name: 'Madrid', city: 'Madrid', flag: '🏟️' },
    { name: 'Valence', city: 'Valence', flag: '🍊' },
    { name: 'Îles Baléares', city: 'Palma', flag: '🏖️' },
    { name: 'Îles Canaries', city: 'Las Palmas', flag: '🌴' },
    { name: 'Pays Basque', city: 'Bilbao', flag: '🍷' },
    { name: 'Galice', city: 'Saint-Jacques-de-Compostelle', flag: '⛪' },
    { name: 'Aragon', city: 'Saragosse', flag: '🏔️' },
    { name: 'Castille-et-León', city: 'Burgos', flag: '🏰' },
    { name: 'Costa Brava', city: 'Gérone', flag: '🌊' },
    { name: 'Costa Blanca', city: 'Alicante', flag: '☀️' },
    { name: 'Costa del Sol', city: 'Málaga', flag: '🌞' },
    { name: 'Grenade & Alhambra', city: 'Grenade', flag: '🕌' },
  ],
  Portugal: [
    { name: 'Algarve', city: 'Faro', flag: '🏖️' },
    { name: 'Lisbonne', city: 'Lisbonne', flag: '🚃' },
    { name: 'Porto & Douro', city: 'Porto', flag: '🍷' },
    { name: 'Alentejo', city: 'Évora', flag: '🌾' },
    { name: 'Madère', city: 'Funchal', flag: '🌺' },
    { name: 'Açores', city: 'Ponta Delgada', flag: '🌊' },
    { name: 'Minho & Viana', city: 'Braga', flag: '⛪' },
  ],
  Italie: [
    { name: 'Toscane', city: 'Florence', flag: '🌻' },
    { name: 'Sicile', city: 'Palerme', flag: '🍋' },
    { name: 'Côte Amalfitaine', city: 'Amalfi', flag: '🏖️' },
    { name: 'Venise & Vénétie', city: 'Venise', flag: '🚤' },
    { name: 'Rome & Latium', city: 'Rome', flag: '🏛️' },
    { name: 'Sardaigne', city: 'Cagliari', flag: '🌊' },
    { name: 'Lombardie', city: 'Milan', flag: '👗' },
    { name: 'Ligurie & Cinque Terre', city: 'La Spezia', flag: '🎨' },
    { name: 'Piémont', city: 'Turin', flag: '🍫' },
    { name: 'Ombrie', city: 'Pérouse', flag: '🫒' },
    { name: 'Puglia', city: 'Bari', flag: '🌅' },
    { name: 'Calabre', city: 'Reggio di Calabria', flag: '🌊' },
  ],
  Grèce: [
    { name: 'Santorin', city: 'Thira', flag: '🌅' },
    { name: 'Mykonos', city: 'Mykonos', flag: '🎉' },
    { name: 'Crète', city: 'Héraklion', flag: '🏛️' },
    { name: 'Athènes & Attique', city: 'Athènes', flag: '🏛️' },
    { name: 'Corfou', city: 'Corfou', flag: '🌿' },
    { name: 'Rhodes', city: 'Rhodes', flag: '☀️' },
    { name: 'Thessalonique', city: 'Thessalonique', flag: '🍴' },
    { name: 'Zante', city: 'Zante', flag: '🐢' },
    { name: 'Cos', city: 'Cos', flag: '🏖️' },
    { name: 'Naxos & Cyclades', city: 'Naxos', flag: '⛵' },
  ],
  Maroc: [
    { name: 'Marrakech', city: 'Marrakech', flag: '🕌' },
    { name: 'Agadir', city: 'Agadir', flag: '🏖️' },
    { name: 'Fès', city: 'Fès', flag: '🎨' },
    { name: 'Essaouira', city: 'Essaouira', flag: '🌊' },
    { name: 'Rabat & Casablanca', city: 'Casablanca', flag: '🏙️' },
    { name: 'Désert du Sahara', city: 'Ouarzazate', flag: '🏜️' },
  ],
  Thaïlande: [
    { name: 'Bangkok & Thaïlande centrale', city: 'Bangkok', flag: '🛺' },
    { name: 'Phuket', city: 'Phuket', flag: '🏖️' },
    { name: 'Koh Samui', city: 'Koh Samui', flag: '🌴' },
    { name: 'Chiang Mai & Nord', city: 'Chiang Mai', flag: '🐘' },
    { name: 'Krabi & îles du Sud', city: 'Krabi', flag: '⛰️' },
    { name: 'Koh Phi Phi', city: 'Koh Phi Phi', flag: '🌊' },
  ],
  Japon: [
    { name: 'Tokyo & Kantô', city: 'Tokyo', flag: '🗼' },
    { name: 'Kyoto & Kansai', city: 'Kyoto', flag: '⛩️' },
    { name: 'Osaka', city: 'Osaka', flag: '🍜' },
    { name: 'Hokkaido', city: 'Sapporo', flag: '❄️' },
    { name: 'Okinawa', city: 'Naha', flag: '🏖️' },
    { name: 'Hiroshima & Nara', city: 'Hiroshima', flag: '🕊️' },
    { name: 'Mont Fuji & Nikko', city: 'Nikko', flag: '🗻' },
  ],
  'États-Unis': [
    { name: 'New York', city: 'New York', flag: '🗽' },
    { name: 'Californie & Los Angeles', city: 'Los Angeles', flag: '🎬' },
    { name: 'Floride & Miami', city: 'Miami', flag: '🌴' },
    { name: 'Hawaï', city: 'Honolulu', flag: '🌺' },
    { name: 'Las Vegas & Nevada', city: 'Las Vegas', flag: '🎰' },
    { name: 'San Francisco', city: 'San Francisco', flag: '🌉' },
    { name: 'Nouvelle-Orléans', city: 'Nouvelle-Orléans', flag: '🎷' },
    { name: 'National Parks (Grand Canyon, Yellowstone)', city: 'Phoenix', flag: '🏔️' },
    { name: 'Chicago & Grands Lacs', city: 'Chicago', flag: '🏙️' },
    { name: 'Texas & Austin', city: 'Austin', flag: '🤠' },
  ],
};

// ── DESTINATIONS "MONDE ENTIER" ── par thème
export const WORLD_DESTINATIONS = [
  // 🏖️ Plage & Soleil
  { name: 'Maldives', country: 'Maldives', theme: 'beach', flag: '🇲🇻', emoji: '🏖️', desc: 'Surdestination luxe, lagon turquoise & villas sur pilotis', distKm: 8200, priceLevel: '€€€€' },
  { name: 'Bali, Indonésie', country: 'Indonésie (Bali)', theme: 'beach', flag: '🇮🇩', emoji: '🌴', desc: 'Temples, rizières en terrasses & plages tropicales', distKm: 11500, priceLevel: '€€' },
  { name: 'Phuket, Thaïlande', country: 'Thaïlande', theme: 'beach', flag: '🇹🇭', emoji: '🏄', desc: 'Plages de sable blanc, vie nocturne & îles paradisiaques', distKm: 9200, priceLevel: '€€' },
  { name: 'Santorin, Grèce', country: 'Grèce', theme: 'beach', flag: '🇬🇷', emoji: '🌅', desc: 'Villages blancs, couchers de soleil magiques & mer Égée', distKm: 2500, priceLevel: '€€€' },
  { name: 'Cancún, Mexique', country: 'Mexique', theme: 'beach', flag: '🇲🇽', emoji: '🐠', desc: 'Caraïbes turquoise, ruines mayas & fêtes légendaires', distKm: 8700, priceLevel: '€€€' },
  { name: 'Seychelles', country: 'Seychelles', theme: 'beach', flag: '🇸🇨', emoji: '🦀', desc: 'Plages de granit rose, coraux & nature préservée', distKm: 9800, priceLevel: '€€€€' },
  { name: 'Polynésie française', country: 'Polynésie française', theme: 'beach', flag: '🇵🇫', emoji: '🐬', desc: 'Bungalows sur pilotis & lagons de Bora Bora', distKm: 15900, priceLevel: '€€€€' },
  { name: 'Algarve, Portugal', country: 'Portugal', theme: 'beach', flag: '🇵🇹', emoji: '🌊', desc: 'Falaises dorées, plages sauvages & gastronomie', distKm: 1600, priceLevel: '€€' },
  { name: 'Costa Rica', country: 'Costa Rica', theme: 'beach', flag: '🇨🇷', emoji: '🐸', desc: 'Jungle & plages du Pacifique, biodiversité exceptionnelle', distKm: 8900, priceLevel: '€€€' },
  { name: 'Îles Canaries, Espagne', country: 'Espagne', theme: 'beach', flag: '🇪🇸', emoji: '🌋', desc: 'Soleil garanti toute l\'année, volcans & plages noires', distKm: 2800, priceLevel: '€€' },
  // ⛰️ Montagne & Nature
  { name: 'Népal & Himalaya', country: 'Népal', theme: 'nature', flag: '🇳🇵', emoji: '🏔️', desc: 'Trekking en Himalaya, base camp Everest & spiritualité', distKm: 7500, priceLevel: '€€' },
  { name: 'Patagonie, Argentine', country: 'Argentine', theme: 'nature', flag: '🇦🇷', emoji: '🦅', desc: 'Glaciers, condors & fin du monde à Torres del Paine', distKm: 13200, priceLevel: '€€€' },
  { name: 'Islande', country: 'Islande', theme: 'nature', flag: '🇮🇸', emoji: '🌌', desc: 'Aurores boréales, geysers, cascades & terres de feu', distKm: 2300, priceLevel: '€€€' },
  { name: 'Norvège & Fjords', country: 'Norvège', theme: 'nature', flag: '🇳🇴', emoji: '🛳️', desc: 'Fjords majestueux, nuits blanches & nature arctique', distKm: 2000, priceLevel: '€€€' },
  { name: 'Nouvelle-Zélande', country: 'Nouvelle-Zélande', theme: 'nature', flag: '🇳🇿', emoji: '🐑', desc: 'Paysages de film, geothermal & trek sur Milford Sound', distKm: 18800, priceLevel: '€€€' },
  { name: 'Kenya & Safari', country: 'Kenya', theme: 'nature', flag: '🇰🇪', emoji: '🦁', desc: 'Grande migration, Big Five & Masai Mara', distKm: 6600, priceLevel: '€€€' },
  { name: 'Mongolie', country: 'Mongolie', theme: 'nature', flag: '🇲🇳', emoji: '🐴', desc: 'Steppes infinies, yourtes & vie nomade authentique', distKm: 7100, priceLevel: '€€' },
  { name: 'Madagascar', country: 'Madagascar', theme: 'nature', flag: '🇲🇬', emoji: '🦎', desc: 'Lémuriens, baobabs & faune endémique unique au monde', distKm: 9000, priceLevel: '€€' },
  { name: 'Écosse', country: 'Royaume-Uni', theme: 'nature', flag: '🇬🇧', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', desc: 'Highlands, châteaux mystiques & whisky single malt', distKm: 1200, priceLevel: '€€€' },
  // 🎭 Culture & Patrimoine
  { name: 'Japon', country: 'Japon', theme: 'culture', flag: '🇯🇵', emoji: '⛩️', desc: 'Temples shintoïstes, cerisiers en fleurs & ultra-modernité', distKm: 9700, priceLevel: '€€€' },
  { name: 'Pérou & Machu Picchu', country: 'Pérou', theme: 'culture', flag: '🇵🇪', emoji: '🏛️', desc: 'Cité inca mythique, Amazonie & lac Titicaca', distKm: 10300, priceLevel: '€€' },
  { name: 'Maroc', country: 'Maroc', theme: 'culture', flag: '🇲🇦', emoji: '🕌', desc: 'Médinas labyrinthiques, désert Sahara & kasbahs', distKm: 2200, priceLevel: '€€' },
  { name: 'Égypte', country: 'Égypte', theme: 'culture', flag: '🇪🇬', emoji: '🔺', desc: 'Pyramides de Gizeh, Nil & trésors pharaoniques', distKm: 3800, priceLevel: '€€' },
  { name: 'Inde', country: 'Inde', theme: 'culture', flag: '🇮🇳', emoji: '🕍', desc: 'Taj Mahal, spiritualité, épices & diversité infinie', distKm: 6700, priceLevel: '€' },
  { name: 'Jordanie', country: 'Jordanie', theme: 'culture', flag: '🇯🇴', emoji: '🏜️', desc: 'Pétra rose, désert Wadi Rum & mer Morte', distKm: 3900, priceLevel: '€€' },
  { name: 'Ouzbékistan', country: 'Ouzbékistan', theme: 'culture', flag: '🇺🇿', emoji: '🕌', desc: 'Samarkand, route de la Soie & mosaïques turquoise', distKm: 5400, priceLevel: '€' },
  { name: 'Cambodge', country: 'Cambodge', theme: 'culture', flag: '🇰🇭', emoji: '🏯', desc: 'Angkor Wat, temples millénaires & sourires khmer', distKm: 10000, priceLevel: '€' },
  { name: 'Cuba', country: 'Cuba', theme: 'culture', flag: '🇨🇺', emoji: '🎵', desc: 'Salsa, Buena Vista, vieilles américaines & cigares', distKm: 8200, priceLevel: '€€' },
  { name: 'Prague, Rép. Tchèque', country: 'République Tchèque', theme: 'culture', flag: '🇨🇿', emoji: '🍺', desc: 'Vieux Prague médiéval, bières artisanales & baroque', distKm: 1500, priceLevel: '€€' },
  // 🏙️ Urbain & Cosmopolite
  { name: 'New York, USA', country: 'États-Unis', theme: 'urban', flag: '🇺🇸', emoji: '🗽', desc: 'La ville qui ne dort jamais, Broadway & Central Park', distKm: 5800, priceLevel: '€€€' },
  { name: 'Dubai, EAU', country: 'Émirats Arabes Unis', theme: 'urban', flag: '🇦🇪', emoji: '🏙️', desc: 'Gratte-ciels vertigineux, luxe & désert aux portes', distKm: 5200, priceLevel: '€€€€' },
  { name: 'Singapour', country: 'Singapour', theme: 'urban', flag: '🇸🇬', emoji: '🌃', desc: 'Jardins futuristes, gastronomie de rue & propre absolue', distKm: 10800, priceLevel: '€€€' },
  { name: 'Tokyo, Japon', country: 'Japon', theme: 'urban', flag: '🇯🇵', emoji: '🗼', desc: 'Néons, sushi, anime & effervescence permanente', distKm: 9700, priceLevel: '€€€' },
  { name: 'Sydney, Australie', country: 'Australie', theme: 'urban', flag: '🇦🇺', emoji: '🦘', desc: 'Opéra iconic, Bondi Beach & qualité de vie légendaire', distKm: 16800, priceLevel: '€€€' },
  { name: 'Buenos Aires, Argentine', country: 'Argentine', theme: 'urban', flag: '🇦🇷', emoji: '🥩', desc: 'Tango, biftecks, architecture européenne & vie nocturne', distKm: 11200, priceLevel: '€€' },
];

// ── Thèmes disponibles ──
export const THEMES = [
  { id: 'all', label: 'Toutes', emoji: '🌍' },
  { id: 'beach', label: 'Plage & Soleil', emoji: '🏖️' },
  { id: 'nature', label: 'Nature & Aventure', emoji: '⛰️' },
  { id: 'culture', label: 'Culture & Patrimoine', emoji: '🎭' },
  { id: 'urban', label: 'Urbain & Cosmopolite', emoji: '🏙️' },
];

// ── Continents ──
export const CONTINENTS = ['Europe', 'Asie', 'Afrique', 'Amériques', 'Océanie'];

// ── Helper : obtenir les régions d'un pays ──
export function getRegionsForCountry(countryName) {
  return REGIONS_BY_COUNTRY[countryName] || [];
}

// ── Helper : déterminer le pays par code géo IP (fallback) ──
export async function detectUserCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return { country: data.country_name, countryCode: data.country_code, city: data.city, region: data.region };
  } catch {
    return { country: 'France', countryCode: 'FR', city: 'Rennes', region: 'Bretagne' };
  }
}

// ── Suggestions saisonnières ──
export function getSeasonalSuggestions() {
  const month = new Date().getMonth() + 1;
  if ([12, 1, 2].includes(month)) {
    return { season: 'hiver', suggestions: ['Maldives', 'Thaïlande', 'Îles Canaries, Espagne', 'Maroc', 'Dubai, EAU'] };
  } else if ([3, 4, 5].includes(month)) {
    return { season: 'printemps', suggestions: ['Japon', 'Bali, Indonésie', 'Maroc', 'Grèce', 'Pérou & Machu Picchu'] };
  } else if ([6, 7, 8].includes(month)) {
    return { season: 'été', suggestions: ['Grèce', 'Algarve, Portugal', 'Croatie', 'Islande', 'Polynésie française'] };
  } else {
    return { season: 'automne', suggestions: ['Japon', 'Nouvelle-Zélande', 'Kenya & Safari', 'Inde', 'Cuba'] };
  }
}
