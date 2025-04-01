// Import secondary scenarios featuring other characters
import secondaryScenarios from './secondaryScenarios';

export const scenarios = [
  // Scenario 1
  {
    id: "exotic_blend",
    characterId: "max",
    title: "Develop a New Exotic Coffee Blend",
    text: "Mr. Celebi, should we invest heavily in R&D for a unique coffee blend? Customers might love the innovation, but it's costly and less sustainable. Or should we stick with cheaper, eco-friendly but traditional blends?",
    choiceA: {
      text: "Invest in the unique blend.",
      money: -20,
      popularity: 15,
      operations: 10,
      sustainability: -5,
      experience: 2
    },
    choiceB: {
      text: "Stick with traditional blends.",
      money: 10,
      popularity: -5,
      operations: -5,
      sustainability: 5,
      experience: 1
    }
  },
  
  // Scenario 2
  {
    id: "bean_quality",
    characterId: "tom",
    title: "Improve Coffee Bean Quality",
    text: "Mr. Celebi, I found a supplier offering premium beans. The quality is great, but they're expensive and not eco-friendly. Should we switch, or stay with our current sustainable suppliers?",
    choiceA: {
      text: "Switch to the new supplier.",
      money: -15,
      popularity: 10,
      operations: 15,
      sustainability: -10,
      experience: 2
    },
    choiceB: {
      text: "Stay with current suppliers.",
      money: 5,
      popularity: -5,
      operations: -5,
      sustainability: 5,
      experience: 1
    }
  },
  
  // Scenario 3
  {
    id: "vegan_options",
    characterId: "bella",
    title: "Offer Vegan and Gluten-Free Options",
    text: "Mr. Celebi, customers are asking for vegan and gluten-free options. Expanding the menu could attract new fans but strain our stocks. Should we do it, or keep the menu simple?",
    choiceA: {
      text: "Expand the menu.",
      money: -10,
      popularity: 10,
      operations: -5,
      sustainability: 5,
      experience: 2
    },
    choiceB: {
      text: "Keep the menu simple.",
      money: 5,
      popularity: -5,
      operations: 5,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 4
  {
    id: "ad_campaign",
    characterId: "max",
    title: "Launch a Major Advertising Campaign",
    text: "Mr. Celebi, a national advertising campaign could skyrocket our popularity, but it's expensive. Should we launch it, or focus on local marketing for now?",
    choiceA: {
      text: "Launch the national campaign.",
      money: -25,
      popularity: 20,
      operations: 0,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Focus on local marketing.",
      money: -5,
      popularity: 5,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 5
  {
    id: "loyalty_program",
    characterId: "bella",
    title: "Implement a Customer Loyalty Program",
    text: "Mr. Celebi, a loyalty program could keep customers coming back. Should we offer generous rewards, or keep it minimal to save costs?",
    choiceA: {
      text: "Offer generous rewards.",
      money: -15,
      popularity: 15,
      operations: 0,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Offer minimal rewards.",
      money: -5,
      popularity: 5,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 6
  {
    id: "community_events",
    characterId: "greta",
    title: "Host Community Events",
    text: "Mr. Celebi, hosting community events could boost our image. Should we go big with large-scale events, or keep it small and manageable?",
    choiceA: {
      text: "Organize large-scale events.",
      money: -20,
      popularity: 15,
      operations: -5,
      sustainability: 5,
      experience: 3
    },
    choiceB: {
      text: "Host small gatherings.",
      money: -5,
      popularity: 5,
      operations: 0,
      sustainability: 2,
      experience: 1
    }
  },
  
  // Scenario 7
  {
    id: "new_store",
    characterId: "max",
    title: "Open a New Store",
    text: "Mr. Celebi, we can open a new store in a prime location, but it's costly. Or should we choose a cheaper spot with less traffic?",
    choiceA: {
      text: "Open in a prime location.",
      money: -30,
      popularity: 10,
      operations: -10,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Choose a cheaper location.",
      money: -10,
      popularity: 5,
      operations: -5,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 8
  {
    id: "supply_chain",
    characterId: "tom",
    title: "Optimize Supply Chain Management",
    text: "Mr. Celebi, advanced logistics software could improve our supply chain, but it's expensive. Should we invest, or stick with our current systems?",
    choiceA: {
      text: "Purchase the software.",
      money: -20,
      popularity: 0,
      operations: 15,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Stick with current systems.",
      money: 5,
      popularity: 0,
      operations: -5,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 9
  {
    id: "automation",
    characterId: "tom",
    title: "Automate Coffee Production",
    text: "Mr. Celebi, automation could boost production but cut jobs and harm sustainability. Should we automate, or keep production manual?",
    choiceA: {
      text: "Invest in automation.",
      money: -25,
      popularity: -10,
      operations: 20,
      sustainability: -5,
      experience: 3
    },
    choiceB: {
      text: "Keep production manual.",
      money: 10,
      popularity: 5,
      operations: -5,
      sustainability: 5,
      experience: 1
    }
  },
  
  // Scenario 10
  {
    id: "eco_packaging",
    characterId: "greta",
    title: "Switch to Eco-Friendly Packaging",
    text: "Mr. Celebi, switching to biodegradable packaging is better for the planet but costly. Should we make the switch, or keep our current packaging?",
    choiceA: {
      text: "Switch to eco-friendly packaging.",
      money: -15,
      popularity: 5,
      operations: 0,
      sustainability: 15,
      experience: 2
    },
    choiceB: {
      text: "Keep current packaging.",
      money: 5,
      popularity: -5,
      operations: 0,
      sustainability: -10,
      experience: 1
    }
  },
  
  // Scenario 11
  {
    id: "fair_trade",
    characterId: "greta",
    title: "Support Fair Trade Coffee Farmers",
    text: "Mr. Celebi, partnering with fair trade groups could improve our image but increase costs. Should we do it, or stick with our current sourcing?",
    choiceA: {
      text: "Partner with fair trade groups.",
      money: -10,
      popularity: 10,
      operations: 5,
      sustainability: 10,
      experience: 2
    },
    choiceB: {
      text: "Stick with current sourcing.",
      money: 5,
      popularity: -5,
      operations: -5,
      sustainability: -5,
      experience: 1
    }
  },
  
  // Scenario 12
  {
    id: "carbon_footprint",
    characterId: "greta",
    title: "Reduce Carbon Footprint",
    text: "Mr. Celebi, investing in renewable energy could greatly reduce our carbon footprint, but it's expensive. Should we invest now, or delay?",
    choiceA: {
      text: "Invest in renewable energy.",
      money: -20,
      popularity: 5,
      operations: 0,
      sustainability: 20,
      experience: 3
    },
    choiceB: {
      text: "Delay sustainability efforts.",
      money: 10,
      popularity: -5,
      operations: 0,
      sustainability: -10,
      experience: 1
    }
  },
  
  // Scenario 13
  {
    id: "employee_wages",
    characterId: "bella",
    title: "Increase Employee Wages",
    text: "Mr. Celebi, our staff is asking for better wages. Should we give a big raise, or offer a small bonus to save money?",
    choiceA: {
      text: "Give a big raise.",
      money: -20,
      popularity: 15,
      operations: 0,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Offer a small bonus.",
      money: -5,
      popularity: 5,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 14
  {
    id: "training_programs",
    characterId: "bella",
    title: "Implement Employee Training Programs",
    text: "Mr. Celebi, thorough training for all staff could improve service but is costly. Should we train everyone, or just new hires?",
    choiceA: {
      text: "Train all staff.",
      money: -15,
      popularity: 10,
      operations: 5,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Train only new hires.",
      money: -5,
      popularity: 2,
      operations: 2,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 15
  {
    id: "workplace_culture",
    characterId: "bella",
    title: "Improve Workplace Culture",
    text: "Mr. Celebi, team-building activities could boost morale but cost money. Should we add them, or keep things as they are?",
    choiceA: {
      text: "Add team-building activities.",
      money: -10,
      popularity: 10,
      operations: 0,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Keep things as they are.",
      money: 5,
      popularity: -5,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 16
  {
    id: "coffee_prices",
    characterId: "max",
    title: "Adjust Coffee Prices",
    text: "Mr. Celebi, raising prices could increase profits but upset customers. Should we raise them, or keep prices steady?",
    choiceA: {
      text: "Raise prices.",
      money: 20,
      popularity: -15,
      operations: 0,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Keep prices steady.",
      money: -5,
      popularity: 10,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 17
  {
    id: "new_technology",
    characterId: "tom",
    title: "Invest in New Technology",
    text: "Mr. Celebi, upgrading our coffee machines could improve quality and stocks but is expensive. Should we upgrade, or stick with old equipment?",
    choiceA: {
      text: "Upgrade the machines.",
      money: -25,
      popularity: 10,
      operations: 15,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Stick with old equipment.",
      money: 10,
      popularity: -5,
      operations: -5,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 18
  {
    id: "cut_costs",
    characterId: "tom",
    title: "Cut Operational Costs",
    text: "Mr. Celebi, reducing staff hours could save money but hurt morale and service. Should we cut hours, or find other efficiencies?",
    choiceA: {
      text: "Reduce staff hours.",
      money: 15,
      popularity: -10,
      operations: -5,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Find other efficiencies.",
      money: 5,
      popularity: -2,
      operations: -2,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 19
  {
    id: "tax_breaks",
    characterId: "greta",
    title: "Lobby for Tax Breaks",
    text: "Mr. Celebi, hiring lobbyists could secure tax breaks but is costly. Should we hire them, or accept current taxes?",
    choiceA: {
      text: "Hire lobbyists.",
      money: -20,
      popularity: 0,
      operations: 0,
      sustainability: 15,
      experience: 2
    },
    choiceB: {
      text: "Accept current taxes.",
      money: -5,
      popularity: 0,
      operations: 0,
      sustainability: -5,
      experience: 1
    }
  },
  
  // Scenario 20
  {
    id: "environmental_regulations",
    characterId: "greta",
    title: "Comply with New Environmental Regulations",
    text: "Mr. Celebi, new regulations require us to reduce waste. Should we invest in compliance now, or delay and risk fines?",
    choiceA: {
      text: "Invest in compliance.",
      money: -15,
      popularity: 5,
      operations: 0,
      sustainability: 10,
      experience: 2
    },
    choiceB: {
      text: "Delay compliance.",
      money: 10,
      popularity: -5,
      operations: 0,
      sustainability: -15,
      experience: 1
    }
  },
  
  // Scenario 21
  {
    id: "expand_country",
    characterId: "max",
    title: "Expand into a New Country",
    text: "Mr. Celebi, entering a high-growth market could be lucrative but risky. Should we expand internationally, or grow domestically?",
    choiceA: {
      text: "Enter the new market.",
      money: -30,
      popularity: 10,
      operations: -10,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Grow domestically.",
      money: -10,
      popularity: 5,
      operations: -5,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 22
  {
    id: "local_partnership",
    characterId: "bella",
    title: "Partner with a Local Business",
    text: "Mr. Celebi, partnering with a local business could boost our image but share profits. Should we partner, or stay independent?",
    choiceA: {
      text: "Form a partnership.",
      money: -15,
      popularity: 10,
      operations: 5,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Stay independent.",
      money: 5,
      popularity: -5,
      operations: -5,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 23
  {
    id: "mobile_app",
    characterId: "max",
    title: "Launch a Mobile App for Ordering",
    text: "Mr. Celebi, a mobile app could make ordering easier but is costly. Should we build it, or stick to in-store orders?",
    choiceA: {
      text: "Build the app.",
      money: -20,
      popularity: 15,
      operations: 0,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Stick to in-store orders.",
      money: 10,
      popularity: -5,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 24
  {
    id: "franchise",
    characterId: "max",
    title: "Offer Franchise Opportunities",
    text: "Mr. Celebi, franchising could bring quick money but risk our brand. Should we allow it, or keep stores company-owned?",
    choiceA: {
      text: "Enable franchising.",
      money: 25,
      popularity: -10,
      operations: 0,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Keep stores company-owned.",
      money: -10,
      popularity: 5,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 25
  {
    id: "coffee_festival",
    characterId: "bella",
    title: "Host a Coffee Festival",
    text: "Mr. Celebi, a coffee festival could create buzz but is expensive. Should we host a big event, or a small tasting?",
    choiceA: {
      text: "Host a big festival.",
      money: -25,
      popularity: 20,
      operations: -10,
      sustainability: 5,
      experience: 3
    },
    choiceB: {
      text: "Host a small tasting.",
      money: -5,
      popularity: 5,
      operations: -2,
      sustainability: 2,
      experience: 1
    }
  },
  
  // Scenario 26
  {
    id: "wellness_programs",
    characterId: "bella",
    title: "Invest in Employee Wellness Programs",
    text: "Mr. Celebi, wellness programs could improve staff health but cost money. Should we offer full plans, or basic benefits?",
    choiceA: {
      text: "Offer full wellness plans.",
      money: -15,
      popularity: 10,
      operations: 0,
      sustainability: 0,
      experience: 2
    },
    choiceB: {
      text: "Offer basic benefits.",
      money: -5,
      popularity: 2,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 27
  {
    id: "store_interiors",
    characterId: "max",
    title: "Upgrade Store Interiors",
    text: "Mr. Celebi, modern interiors could attract customers but are costly. Should we renovate, or make minor updates?",
    choiceA: {
      text: "Renovate with modern designs.",
      money: -30,
      popularity: 15,
      operations: 0,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Make minor updates.",
      money: -10,
      popularity: 5,
      operations: 0,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 28
  {
    id: "subscription_service",
    characterId: "tom",
    title: "Introduce a Subscription Service",
    text: "Mr. Celebi, a coffee subscription could provide steady income but strain logistics. Should we launch it, or focus on in-store sales?",
    choiceA: {
      text: "Launch the subscription.",
      money: -20,
      popularity: 10,
      operations: -10,
      sustainability: 0,
      experience: 3
    },
    choiceB: {
      text: "Focus on in-store sales.",
      money: 10,
      popularity: -5,
      operations: 5,
      sustainability: 0,
      experience: 1
    }
  },
  
  // Scenario 29
  {
    id: "sustainability_certification",
    characterId: "greta",
    title: "Participate in a Sustainability Certification",
    text: "Mr. Celebi, joining a sustainability certification could boost our image but is costly. Should we participate, or opt out?",
    choiceA: {
      text: "Join the certification.",
      money: -15,
      popularity: 5,
      operations: 0,
      sustainability: 15,
      experience: 2
    },
    choiceB: {
      text: "Opt out.",
      money: 10,
      popularity: -5,
      operations: 0,
      sustainability: -10,
      experience: 1
    }
  },
  
  // Scenario 30
  {
    id: "new_brewing_method",
    characterId: "bella",
    title: "Develop a New Coffee Brewing Method",
    text: "Mr. Celebi, innovating a unique brewing method could set us apart but requires investment. Should we innovate, or stick with traditional methods?",
    choiceA: {
      text: "Innovate a new method.",
      money: -25,
      popularity: 15,
      operations: 10,
      sustainability: -5,
      experience: 3
    },
    choiceB: {
      text: "Stick with traditional methods.",
      money: 10,
      popularity: -5,
      operations: -5,
      sustainability: 5,
      experience: 1
    }
  },

  // Add secondary character scenarios
  ...secondaryScenarios
];
