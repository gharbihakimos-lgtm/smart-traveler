export function calculateEcoScore(distanceKm, transport = 'auto') {
  const dist = distanceKm || 500;
  
  // Transport estimation if not explicit
  let trainCo2 = Math.round(dist * 0.014); // ~14g CO2/km
  let carCo2 = Math.round(dist * 0.12);    // ~120g CO2/km
  let planeCo2 = Math.round(dist * 0.23);  // ~230g CO2/km

  let estimatedCo2 = dist <= 500 ? trainCo2 : dist <= 1000 ? carCo2 : planeCo2;
  
  let scoreGrade = 'A+';
  let badgeColor = '#10b981';
  let label = 'Empreinte Carbone Très Faible';

  if (estimatedCo2 > 250) {
    scoreGrade = 'C';
    badgeColor = '#ef4444';
    label = 'Empreinte Carbone Élevée (Vol / Longue distance)';
  } else if (estimatedCo2 > 120) {
    scoreGrade = 'B';
    badgeColor = '#f59e0b';
    label = 'Empreinte Carbone Modérée';
  } else if (estimatedCo2 > 40) {
    scoreGrade = 'A';
    badgeColor = '#14b8a6';
    label = 'Empreinte Carbone Faible (Éco-voyage)';
  }

  return {
    co2Kg: estimatedCo2,
    scoreGrade,
    badgeColor,
    label,
    trainCo2,
    carCo2,
    planeCo2
  };
}
