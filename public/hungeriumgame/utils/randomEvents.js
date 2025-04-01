// Random event generator for dynamic gameplay

import { getCharacterForEvent } from './characterUtils';

/**
 * Generate realistic random events that affect the coffee shop
 * These are unexpected situations that test player adaptability
 */

// Variety of event types
const EVENT_TYPES = {
  WEATHER: 'weather',
  ECONOMIC: 'economic',
  SOCIAL: 'social',
  STAFF: 'staff',
  EQUIPMENT: 'equipment',
  SUPPLY_CHAIN: 'supplyChain',
  COMPETITION: 'competition',
  REGULATIONS: 'regulations'
};

// Bank of random events
const randomEvents = [
  // Weather events
  {
    id: 'heavy_rain',
    type: EVENT_TYPES.WEATHER,
    title: 'Heavy Rainfall',
    text: 'A major storm is bringing heavy rain to your area. Customer traffic might be affected.',
    characterId: 'weatherman',
    choiceA: {
      text: 'Offer "Rainy Day Discounts" to encourage visits',
      money: -8,
      popularity: 12,
      operations: -5,
      sustainability: 0
    },
    choiceB: {
      text: 'Focus on delivery options today',
      money: -5,
      popularity: 5,
      operations: -10,
      sustainability: -3
    }
  },
  {
    id: 'heatwave',
    type: EVENT_TYPES.WEATHER,
    title: 'Unexpected Heatwave',
    text: 'A sudden heatwave has hit the city. Hot coffee sales might drop, but it\'s an opportunity for cold drinks.',
    characterId: 'weatherman',
    choiceA: {
      text: 'Quickly promote iced coffee options',
      money: -3,
      popularity: 10,
      operations: -7,
      sustainability: 0
    },
    choiceB: {
      text: 'Install extra air conditioning for comfort',
      money: -15,
      popularity: 15,
      operations: 0,
      sustainability: -8
    }
  },
  
  // Economic events
  {
    id: 'rent_increase',
    type: EVENT_TYPES.ECONOMIC,
    title: 'Rent Increase Notice',
    text: 'Your landlord has informed you that rent will increase by 15% next month due to rising property values.',
    characterId: 'landlord',
    choiceA: {
      text: 'Negotiate a smaller increase with longer lease',
      money: -10,
      popularity: 0,
      operations: 0,
      sustainability: 0
    },
    choiceB: {
      text: 'Raise prices slightly to cover increased costs',
      money: 5,
      popularity: -8,
      operations: 0,
      sustainability: 0
    }
  },
  {
    id: 'coffee_price_spike',
    type: EVENT_TYPES.ECONOMIC,
    title: 'Coffee Bean Price Spike',
    text: 'Global coffee prices have suddenly increased by 20% due to crop failures in major producing regions.',
    characterId: 'supplier',
    choiceA: {
      text: 'Absorb the cost temporarily to maintain quality',
      money: -15,
      popularity: 5,
      operations: 0,
      sustainability: 0
    },
    choiceB: {
      text: 'Switch to more affordable bean varieties',
      money: 0,
      popularity: -10,
      operations: 0,
      sustainability: -5
    }
  },
  
  // Staff events
  {
    id: 'staff_illness',
    type: EVENT_TYPES.STAFF,
    title: 'Staff Illness',
    text: 'Three of your baristas have called in sick today. You\'re severely understaffed for the day.',
    characterId: 'barista',
    choiceA: {
      text: 'Work extra hours yourself to cover the shifts',
      money: 0,
      popularity: -5,
      operations: -8,
      sustainability: 0,
      staff: 0
    },
    choiceB: {
      text: 'Offer overtime pay to available staff',
      money: -12,
      popularity: 0,
      operations: 0,
      sustainability: 0,
      staff: 1
    }
  },
  {
    id: 'staff_training',
    type: EVENT_TYPES.STAFF,
    title: 'Advanced Barista Training',
    text: 'A renowned coffee expert is offering a one-day advanced training workshop for baristas.',
    characterId: 'trainer',
    choiceA: {
      text: 'Send your staff to the training',
      money: -10,
      popularity: 7,
      operations: 0,
      sustainability: 0,
      staff: 2,
      experience: 2
    },
    choiceB: {
      text: 'Skip it and keep your regular schedule',
      money: 0,
      popularity: 0,
      operations: 0,
      sustainability: 0
    }
  },
  
  // Equipment events
  {
    id: 'espresso_breakdown',
    type: EVENT_TYPES.EQUIPMENT,
    title: 'Espresso Machine Breakdown',
    text: 'Your main espresso machine has broken down right before the morning rush!',
    characterId: 'technician',
    choiceA: {
      text: 'Call emergency repair service (expensive but fast)',
      money: -25,
      popularity: 0,
      operations: -5,
      sustainability: 0,
      equipment: 1
    },
    choiceB: {
      text: 'Use backup methods and offer discounts to customers',
      money: -10,
      popularity: -8,
      operations: -15,
      sustainability: 0
    }
  },
  
  // Social media events
  {
    id: 'influencer_visit',
    type: EVENT_TYPES.SOCIAL,
    title: 'Surprise Influencer Visit',
    text: 'A local social media influencer with 50,000 followers just walked in and is considering featuring your shop.',
    characterId: 'influencer',
    choiceA: {
      text: 'Give special treatment and free items',
      money: -8,
      popularity: 15,
      operations: -5,
      sustainability: 0,
      loyalty: 10
    },
    choiceB: {
      text: 'Treat them like a normal customer',
      money: 0,
      popularity: -5,
      operations: 0,
      sustainability: 0
    }
  },
  
  // Supply chain events
  {
    id: 'delivery_delay',
    type: EVENT_TYPES.SUPPLY_CHAIN,
    title: 'Supply Delivery Delay',
    text: 'Your weekly supply delivery is delayed by at least 2 days due to transportation issues.',
    characterId: 'supplier',
    choiceA: {
      text: 'Find a local alternative supplier (more expensive)',
      money: -15,
      popularity: 0,
      operations: 10,
      sustainability: 5
    },
    choiceB: {
      text: 'Limit menu options until delivery arrives',
      money: -5,
      popularity: -10,
      operations: -5,
      sustainability: 0
    }
  },
  
  // Competition events
  {
    id: 'new_competitor',
    type: EVENT_TYPES.COMPETITION,
    title: 'New Competitor Opening',
    text: 'A new trendy coffee chain is opening just down the street next week with a major launch promotion.',
    characterId: 'competitor',
    choiceA: {
      text: 'Launch your own promotion to retain customers',
      money: -20,
      popularity: 15,
      operations: -8,
      sustainability: -5
    },
    choiceB: {
      text: 'Focus on quality and loyal customers instead',
      money: 0,
      popularity: -5,
      operations: 5,
      sustainability: 5,
      loyalty: 15
    }
  },
  
  // Regulations events
  {
    id: 'health_inspection',
    type: EVENT_TYPES.REGULATIONS,
    title: 'Surprise Health Inspection',
    text: 'A health inspector has arrived for an unscheduled inspection of your café.',
    characterId: 'inspector',
    choiceA: {
      text: 'Welcome the inspection confidently',
      money: 0,
      popularity: 0,
      operations: -5,
      sustainability: 5,
      experience: 2
    },
    choiceB: {
      text: 'Request time to prepare (looks suspicious)',
      money: 0,
      popularity: -10,
      operations: 0,
      sustainability: -8
    }
  },
  
  // Positive opportunity events
  {
    id: 'local_event',
    type: EVENT_TYPES.SOCIAL,
    title: 'Local Festival Opportunity',
    text: 'The city is hosting a food and drink festival this weekend. They\'re inviting local businesses to participate.',
    characterId: 'event_organizer',
    choiceA: {
      text: 'Set up a booth at the festival',
      money: -15,
      popularity: 20,
      operations: -10,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: 'Decline and focus on your store',
      money: 0,
      popularity: -5,
      operations: 5,
      sustainability: 0
    }
  },
  
  // Sustainability events
  {
    id: 'plastic_ban',
    type: EVENT_TYPES.REGULATIONS,
    title: 'Single-Use Plastic Ban',
    text: 'The city will ban single-use plastics next month. You need to adapt your takeaway packaging.',
    characterId: 'city_official',
    choiceA: {
      text: 'Invest in compostable packaging',
      money: -20,
      popularity: 10,
      operations: -5,
      sustainability: 25
    },
    choiceB: {
      text: 'Use cheaper paper alternatives',
      money: -10,
      popularity: 0,
      operations: 0,
      sustainability: 10
    }
  }
];

/**
 * Get a random event from the pool
 * @param {Object} gameState Current game state to help pick relevant events
 * @returns {Object} A random event scenario
 */
export const getRandomEvent = (gameState = {}) => {
  const { metrics = {} } = gameState;
  
  // Select events that might be more relevant to current metrics
  let relevantEvents = [...randomEvents];
  
  // If any metric is low, prioritize events that could help improve it
  if (metrics.financial <= 30) {
    relevantEvents = relevantEvents.filter(event => 
      event.choiceA.money > 0 || event.choiceB.money > 0
    );
  } else if (metrics.satisfaction <= 30) {
    relevantEvents = relevantEvents.filter(event => 
      event.choiceA.popularity > 0 || event.choiceB.popularity > 0
    );
  } else if (metrics.stock <= 30) {
    relevantEvents = relevantEvents.filter(event => 
      event.choiceA.operations > 0 || event.choiceB.operations > 0
    );
  } else if (metrics.sustainability <= 30) {
    relevantEvents = relevantEvents.filter(event => 
      event.choiceA.sustainability > 0 || event.choiceB.sustainability > 0
    );
  }
  
  // If no relevant events found, use the full list
  if (relevantEvents.length === 0) {
    relevantEvents = randomEvents;
  }
  
  // Pick a random event from the filtered list
  const randomIndex = Math.floor(Math.random() * relevantEvents.length);
  const event = { ...relevantEvents[randomIndex] };  // Create a copy to avoid modifying original
  
  // Make sure the event has a valid character assigned
  // Get appropriate character for this event type if not already specified or invalid
  if (!event.characterId || typeof event.characterId !== 'string') {
    const character = getCharacterForEvent(event.type);
    if (character) {
      event.characterId = character.id;
      console.log(`[RandomEvent] Assigned character ${character.id} to event ${event.id}`);
    }
  }
  
  return event;
};

export default randomEvents;
