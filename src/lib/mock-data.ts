// This file contains constants and mock data for the UI
// Not used for actual data fetching but for static content like labels, options, etc.

export const CATEGORIES = {
  PRODUCTS: [
    "Grains",
    "Vegetables",
    "Fruits",
    "Livestock",
    "Dairy",
    "Poultry",
    "Seeds",
    "Equipment",
    "Fertilizer"
  ],
  
  WASTE_TYPES: [
    "Compost",
    "Biomass",
    "Animal Waste",
    "Crop Residue",
    "Processing Waste"
  ],
  
  BARTER: [
    "Seeds",
    "Tools",
    "Labor",
    "Equipment",
    "Knowledge"
  ],
  
  MICROJOBS: [
    "Field Work",
    "Technical",
    "Transportation",
    "Processing",
    "Administrative",
    "Education",
    "Marketing"
  ],
  
  PROPOSALS: [
    "Infrastructure",
    "Education",
    "Market Access",
    "Research",
    "Community",
    "Policy",
    "Environment"
  ],
  
  EDUCATION: [
    "Web3",
    "DeFi",
    "Farming Techniques",
    "Sustainability",
    "Governance",
    "Insurance",
    "Marketing"
  ]
};

export const DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced"
];

export const RISK_LEVELS = [
  "low",
  "medium",
  "high"
];

export const STATUSES = {
  PRODUCTS: [
    "available",
    "pending",
    "sold"
  ],
  
  BARTER: [
    "available",
    "negotiating",
    "completed"
  ],
  
  MICROJOBS: [
    "open",
    "in-progress",
    "completed"
  ],
  
  PROPOSALS: [
    "active",
    "passed",
    "rejected"
  ],
  
  LIQUIDITY_POOLS: [
    "active",
    "full",
    "closing"
  ]
};

export const UNITS = [
  "kg",
  "ton",
  "piece",
  "hour",
  "day",
  "hectare",
  "liter"
];

export const PAYMENT_TYPES = [
  "Crypto",
  "Fiat",
  "Token",
  "Hybrid"
];

export const STATS = {
  users: 845,
  farmers: 620,
  products: 2184,
  barterItems: 312,
  microjobs: 156,
  proposals: 28,
  totalLiquidity: 1250000
};

export const WEB3_TERMS = [
  {
    term: "DAO",
    definition: "Decentralized Autonomous Organization - A community-led entity with no central authority."
  },
  {
    term: "DeFi",
    definition: "Decentralized Finance - Financial services built on blockchain technology without central intermediaries."
  },
  {
    term: "Smart Contract",
    definition: "Self-executing contract with the terms directly written into code."
  },
  {
    term: "Liquidity Pool",
    definition: "Collection of funds locked in a smart contract to facilitate trading and lending."
  },
  {
    term: "Yield Farming",
    definition: "Strategy of lending or staking cryptocurrency assets to generate returns."
  },
  {
    term: "NFT",
    definition: "Non-Fungible Token - Digital asset representing real-world items like art, videos, or in-game items."
  }
];

export const PAGE_DESCRIPTIONS = {
  dashboard: "Overview of your agricultural activities and platform insights",
  marketplace: "Buy and sell agricultural products and waste materials",
  barter: "Exchange seeds, tools, and labor with other farmers",
  governance: "Participate in community decision-making through DAO proposals",
  microjobs: "Find short-term agricultural work or hire skilled workers",
  liquidityHub: "Access DeFi-powered financial services for agricultural needs",
  education: "Learn about Web3 technologies and their agricultural applications"
};
