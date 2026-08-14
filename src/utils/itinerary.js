export function generateItinerary(hotel) {
  const loc = hotel.location || 'la destination';
  const name = hotel.name || 'Hôtel';
  const isCamping = hotel.type === 'camping';
  const isBeach = hotel.beachScore >= 4;

  return [
    {
      day: 1,
      title: "Jour 1 : Arrivée & Immersion Locale",
      activities: [
        { time: "09:00 - 12:00", title: "Installation & Accueil", desc: `Arrivée à ${name}, remise des clés et découverte des équipements.` },
        { time: "12:30 - 14:00", title: "Déjeuner de Spécialités", desc: `Dégustation de la gastronomie locale dans un restaurant recommandé de ${loc}.` },
        { time: "14:30 - 18:00", title: isBeach ? "Après-midi Détente & Plage" : "Balade Exploratoire", desc: isBeach ? "Baignade, farniente et promenade au bord de l'eau." : "Découverte des ruelles historiques et des panoramas environnants." },
        { time: "20:00 - 22:30", title: "Soirée de Bienvenue", desc: "Dîner au coucher du soleil et verre en terrasse." }
      ]
    },
    {
      day: 2,
      title: "Jour 2 : Incontournables & Activités",
      activities: [
        { time: "08:30 - 10:00", title: "Petit-déjeuner Énergétique", desc: "Buffet ou petit-déjeuner sur la terrasse." },
        { time: "10:30 - 13:00", title: isCamping ? "Parc Aquatique & Sports" : "Visite Culturelle & Patrimoine", desc: isCamping ? "Profitez des équipements sportifs et de la piscine." : "Exploration des monuments majeurs et des musées régionaux." },
        { time: "14:00 - 17:30", title: "Excursion ou Randonnée Nature", desc: `Découverte des paysages exceptionnels et points de vue phares de ${loc}.` },
        { time: "19:30 - 22:00", title: "Dîner Gastronomique", desc: "Soirée gourmande et ambiance chaleureuse." }
      ]
    },
    {
      day: 3,
      title: "Jour 3 : Souvenirs & Détente Ultime",
      activities: [
        { time: "09:30 - 12:00", title: "Marché Artisanal & Shopping", desc: "Achat de produits régionaux et souvenirs locaux." },
        { time: "12:30 - 14:30", title: "Déjeuner d'Adieu", desc: "Dernier repas convivial face aux paysages." },
        { time: "15:00 - 17:00", title: "Détente avant le Départ", desc: "Dernier plouf en piscine ou soin relaxation avant de prendre la route." }
      ]
    }
  ];
}
