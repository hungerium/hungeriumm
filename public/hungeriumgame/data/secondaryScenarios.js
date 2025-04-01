/**
 * Scenarios featuring secondary characters with balanced metric effects
 */

const secondaryScenarios = [
  // Weather-related scenarios (Meteorologist Sam)
  {
    id: 'unexpected_fog',
    title: 'Morning Fog',
    text: 'Dense fog has settled over the city, reducing visibility. Commuters might skip their morning coffee stop.',
    characterId: 'weatherman',
    choiceA: {
      text: 'Offer "Fog Special" discounts during morning hours',
      money: -8,
      popularity: 12,
      operations: -3,
      sustainability: 0
    },
    choiceB: {
      text: 'Create a cozy atmosphere with mood lighting and warm drinks',
      money: -5,
      popularity: 10,
      operations: -6,
      sustainability: 3
    }
  },
  {
    id: 'spring_showers',
    title: 'Spring Showers',
    text: 'A week of intermittent rain is forecasted. This could affect your outdoor seating area.',
    characterId: 'weatherman',
    choiceA: {
      text: 'Install temporary awnings to keep outdoor seating dry',
      money: -12,
      popularity: 8,
      operations: 0,
      sustainability: -5
    },
    choiceB: {
      text: 'Focus on creating indoor comfort and warmth',
      money: -6,
      popularity: 6,
      operations: -3,
      sustainability: 4
    }
  },
  
  // Supply chain scenarios (Marco the supplier)
  {
    id: 'seasonal_beans',
    title: 'Seasonal Bean Opportunity',
    text: 'A limited batch of premium seasonal beans has become available, but they cost 30% more than your regular supply.',
    characterId: 'supplier',
    choiceA: {
      text: 'Purchase the seasonal beans and create a special menu',
      money: -15,
      popularity: 18,
      operations: -5,
      sustainability: 8
    },
    choiceB: {
      text: 'Stick with your regular coffee beans',
      money: 0,
      popularity: -5,
      operations: 5,
      sustainability: 0
    }
  },
  {
    id: 'supplier_discount',
    title: 'Bulk Order Opportunity',
    text: 'Your supplier is offering a 15% discount if you commit to a 3-month bulk order of coffee beans.',
    characterId: 'supplier',
    choiceA: {
      text: 'Take the bulk discount deal',
      money: -25,
      popularity: 0,
      operations: 18,
      sustainability: -10
    },
    choiceB: {
      text: 'Continue with your regular ordering schedule',
      money: 5,
      popularity: 0,
      operations: -8,
      sustainability: 5
    }
  },
  
  // Equipment scenarios (Henry the technician)
  {
    id: 'upgrade_grinder',
    title: 'Grinder Upgrade',
    text: 'Your coffee grinder is working but outdated. A new precision grinder could improve coffee quality but is expensive.',
    characterId: 'technician',
    choiceA: {
      text: 'Invest in the new precision grinder',
      money: -22,
      popularity: 15,
      operations: 12,
      sustainability: -5,
      equipment: 2
    },
    choiceB: {
      text: 'Keep using the current grinder until it breaks',
      money: 0,
      popularity: -5,
      operations: -10,
      sustainability: 8
    }
  },
  {
    id: 'water_filtration',
    title: 'Water Filtration System',
    text: 'Henry suggests installing a better water filtration system that would improve coffee taste and reduce machine maintenance.',
    characterId: 'technician',
    choiceA: {
      text: 'Install the advanced filtration system',
      money: -18,
      popularity: 12,
      operations: 8,
      sustainability: 10,
      equipment: 1
    },
    choiceB: {
      text: 'Keep the current basic water filter',
      money: 5,
      popularity: -8,
      operations: -5,
      sustainability: -8
    }
  },
  
  // Social media scenarios (Sophia the influencer)
  {
    id: 'viral_drink',
    title: 'Trending Creation',
    text: 'A food influencer wants to create a custom drink with your shop that might go viral on social media.',
    characterId: 'influencer',
    choiceA: {
      text: 'Collaborate on a photogenic signature drink',
      money: -10,
      popularity: 20,
      operations: -10,
      sustainability: -5
    },
    choiceB: {
      text: 'Stick to your classic, quality offerings',
      money: 3,
      popularity: -5,
      operations: 8,
      sustainability: 10
    }
  },
  {
    id: 'instagram_corner',
    title: 'Instagram-Worthy Corner',
    text: 'Sophia suggests creating a dedicated photo corner in your shop to attract social media users.',
    characterId: 'influencer',
    choiceA: {
      text: 'Create an aesthetic photo wall with props',
      money: -12,
      popularity: 18,
      operations: -5,
      sustainability: -8
    },
    choiceB: {
      text: 'Keep your minimal, cozy atmosphere',
      money: 0,
      popularity: -3,
      operations: 5,
      sustainability: 10
    }
  },
  
  // Regulatory scenarios (Ms. Rodriguez the inspector)
  {
    id: 'safety_standards',
    title: 'Updated Safety Standards',
    text: 'New food safety regulations require additional documentation and potentially new equipment.',
    characterId: 'inspector',
    choiceA: {
      text: 'Implement all recommendations immediately',
      money: -15,
      popularity: 5,
      operations: -10,
      sustainability: 15
    },
    choiceB: {
      text: 'Make minimum required changes gradually',
      money: -8,
      popularity: -5,
      operations: 0,
      sustainability: 5
    }
  },
  {
    id: 'employee_training',
    title: 'Staff Certification',
    text: 'A health inspector recommends an optional advanced food handling certification for all staff.',
    characterId: 'inspector',
    choiceA: {
      text: 'Pay for all staff to get certified',
      money: -12,
      popularity: 10,
      operations: 12,
      sustainability: 5,
      staff: 2
    },
    choiceB: {
      text: 'Only certify managers to save costs',
      money: -5,
      popularity: 0,
      operations: 5,
      sustainability: 0,
      staff: 1
    }
  },
  
  // Government policy scenarios (Councilor Park)
  {
    id: 'local_tax_incentive',
    title: 'Green Business Incentive',
    text: 'The city council is offering tax breaks for businesses that adopt specific eco-friendly practices.',
    characterId: 'city_official',
    choiceA: {
      text: 'Revamp operations to qualify for incentives',
      money: -20,
      popularity: 8,
      operations: -10,
      sustainability: 25
    },
    choiceB: {
      text: 'Maintain current practices to avoid disruption',
      money: 10,
      popularity: -5,
      operations: 10,
      sustainability: -15
    }
  },
  {
    id: 'community_event',
    title: 'Community Festival Participation',
    text: 'City officials are seeking local businesses to sponsor a community festival next month.',
    characterId: 'city_official',
    choiceA: {
      text: 'Become a major sponsor with a booth',
      money: -18,
      popularity: 20,
      operations: -8,
      sustainability: 10
    },
    choiceB: {
      text: 'Provide a small donation only',
      money: -5,
      popularity: 5,
      operations: 0,
      sustainability: 3
    }
  }
];

export default secondaryScenarios;
