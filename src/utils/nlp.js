export const analyzeTravelRequest = (text, history) => {
  const data = {};
  let textLower = text.toLowerCase();
  
  // Combine history to analyze context
  const fullContext = history.map(h => h.content).join(' ') + ' ' + textLower;

  // 1. Destination
  if (textLower.match(/espagne|madrid|barcelone|andalousie|ténérife/)) {
    data.destinationType = 'country';
    data.destinationCountry = 'Espagne';
  } else if (textLower.match(/france|paris|bretagne|corse|côte d'azur/)) {
    data.destinationType = 'country';
    data.destinationCountry = 'France';
  } else if (textLower.match(/autour de moi|proche|pas trop loin|rayon/)) {
    data.destinationType = 'around_me';
  }

  // 2. Budget
  const budgetMatch = textLower.match(/(\d+)\s*(€|euros)/);
  if (budgetMatch) {
    data.budget = parseInt(budgetMatch[1], 10);
  }

  // 3. People (Adults / Children)
  const adultsMatch = textLower.match(/(\d+)\s*(adultes?|personnes?|potes?|amis?)/);
  if (adultsMatch) {
    data.adults = parseInt(adultsMatch[1], 10);
  }
  
  const kidsMatch = textLower.match(/(\d+)\s*(enfants?|bébés?|gamins?|ados?)/);
  if (kidsMatch) {
    data.children = parseInt(kidsMatch[1], 10);
  } else if (textLower.includes('en famille') || textLower.includes('avec les enfants')) {
    data.children = 2; // Guess default
  }

  // 4. Priorities
  data.priorities = {};
  if (textLower.match(/piscine|nager|baignade/)) data.priorities.pool = 5;
  if (textLower.match(/plage|mer|océan|sable/)) data.priorities.beach = 5;
  if (textLower.match(/calme|tranquille|repos|détente|silence/)) data.priorities.quiet = 5;
  if (textLower.match(/luxe|5 étoiles|haut de gamme|chic/)) data.priorities.luxury = 5;
  if (textLower.match(/nature|forêt|montagne|vert|randonnée/)) data.priorities.nature = 5;
  
  // Return extracted data and check if we have enough
  const score = Object.keys(data).length;
  return {
    extractedData: data,
    hasEnoughInfo: score >= 3 // If we found at least 3 things, it's enough to start
  };
};
