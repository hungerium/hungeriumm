export const tokenMarketData = {
  // Historical price data (simulated)
  priceHistory: [
    { date: '2023-01-01', price: 0.5 },
    { date: '2023-02-01', price: 0.62 },
    { date: '2023-03-01', price: 0.58 },
    { date: '2023-04-01', price: 0.75 },
    { date: '2023-05-01', price: 0.9 },
    { date: '2023-06-01', price: 0.85 },
    { date: '2023-07-01', price: 1.0 }
  ],
  
  // Market stats (simulated)
  marketStats: {
    marketCap: 1000000, // $1M market cap
    volume24h: 50000,    // $50K 24h volume
    circulatingSupply: 1000000,  // 1M tokens in circulation
    totalSupply: 10000000,       // 10M total supply
  },
  
  // Initial price range
  initialPriceRange: {
    min: 0.8,
    max: 1.2
  }
};

// Coffee token utility information
export const tokenUtility = [
  {
    title: "Shop Upgrades",
    description: "Spend COFFEE tokens to upgrade your shop equipment and efficiency"
  },
  {
    title: "Sustainability Boost",
    description: "Higher token value increases sustainable practices rewards"
  },
  {
    title: "Governance Voting",
    description: "Coming soon: Influence the CoffeeFi ecosystem with token voting"
  }
];

// Game impacts on token price
export const tokenPriceFactors = {
  sustainability: {
    impact: "high",
    description: "Sustainable practices strongly affect token value"
  },
  popularity: {
    impact: "medium",
    description: "Popular shops create more demand for tokens"
  },
  operations: {
    impact: "low",
    description: "Operational efficiency has a small effect on token value"
  }
};
