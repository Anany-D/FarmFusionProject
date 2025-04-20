import { 
  users, User, InsertUser, 
  marketplaceItems, MarketplaceItem, InsertMarketplaceItem,
  barterOffers, BarterOffer, InsertBarterOffer,
  microjobs, Microjob, InsertMicrojob,
  daoProposals, DaoProposal, InsertDaoProposal,
  liquidityPools, LiquidityPool, InsertLiquidityPool
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Marketplace operations
  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  getMarketplaceItemById(id: number): Promise<MarketplaceItem | undefined>;
  getMarketplaceItemsByUserId(userId: number): Promise<MarketplaceItem[]>;
  getMarketplaceItemsByCategory(category: string): Promise<MarketplaceItem[]>;
  createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem>;
  
  // Barter operations
  getBarterOffers(): Promise<BarterOffer[]>;
  getBarterOfferById(id: number): Promise<BarterOffer | undefined>;
  getBarterOffersByUserId(userId: number): Promise<BarterOffer[]>;
  createBarterOffer(offer: InsertBarterOffer): Promise<BarterOffer>;
  updateBarterOfferStatus(id: number, status: string): Promise<BarterOffer | undefined>;
  
  // Microjob operations
  getMicrojobs(): Promise<Microjob[]>;
  getMicrojobById(id: number): Promise<Microjob | undefined>;
  getMicrojobsByUserId(userId: number): Promise<Microjob[]>;
  createMicrojob(job: InsertMicrojob): Promise<Microjob>;
  updateMicrojobStatus(id: number, status: string): Promise<Microjob | undefined>;
  
  // DAO Proposal operations
  getDaoProposals(): Promise<DaoProposal[]>;
  getDaoProposalById(id: number): Promise<DaoProposal | undefined>;
  createDaoProposal(proposal: InsertDaoProposal): Promise<DaoProposal>;
  voteOnProposal(id: number, vote: "for" | "against"): Promise<DaoProposal | undefined>;
  
  // Liquidity Pool operations
  getLiquidityPools(risk?: string): Promise<LiquidityPool[]>;
  getLiquidityPoolById(id: number): Promise<LiquidityPool | undefined>;
  createLiquidityPool(pool: InsertLiquidityPool): Promise<LiquidityPool>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private marketplaceItems: Map<number, MarketplaceItem>;
  private barterOffers: Map<number, BarterOffer>;
  private microjobs: Map<number, Microjob>;
  private daoProposals: Map<number, DaoProposal>;
  private liquidityPools: Map<number, LiquidityPool>;
  
  private userId: number;
  private marketplaceItemId: number;
  private barterOfferId: number;
  private microjobId: number;
  private daoProposalId: number;
  private liquidityPoolId: number;

  constructor() {
    this.users = new Map();
    this.marketplaceItems = new Map();
    this.barterOffers = new Map();
    this.microjobs = new Map();
    this.daoProposals = new Map();
    this.liquidityPools = new Map();
    
    this.userId = 1;
    this.marketplaceItemId = 1;
    this.barterOfferId = 1;
    this.microjobId = 1;
    this.daoProposalId = 1;
    this.liquidityPoolId = 1;
    
    // Add some initial data for demonstration
    this.initializeDemoData();
  }
  
  // Liquidity Pool operations
  async getLiquidityPools(risk?: string): Promise<LiquidityPool[]> {
    let pools = Array.from(this.liquidityPools.values());
    
    if (risk) {
      pools = pools.filter(pool => pool.risk === risk);
    }
    
    return pools;
  }

  async getLiquidityPoolById(id: number): Promise<LiquidityPool | undefined> {
    return this.liquidityPools.get(id);
  }

  async createLiquidityPool(pool: InsertLiquidityPool): Promise<LiquidityPool> {
    const id = this.liquidityPoolId++;
    const newPool: LiquidityPool = { 
      ...pool, 
      id, 
      imageUrl: pool.imageUrl || null,
      createdAt: new Date() 
    };
    this.liquidityPools.set(id, newPool);
    return newPool;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      verified: false,
      walletAddress: insertUser.walletAddress || null,
      bio: insertUser.bio || null,
      profileImage: null
    };
    this.users.set(id, user);
    return user;
  }

  // Marketplace operations
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values());
  }

  async getMarketplaceItemById(id: number): Promise<MarketplaceItem | undefined> {
    return this.marketplaceItems.get(id);
  }

  async getMarketplaceItemsByUserId(userId: number): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async getMarketplaceItemsByCategory(category: string): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values()).filter(
      (item) => item.category === category,
    );
  }

  async createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const id = this.marketplaceItemId++;
    const newItem: MarketplaceItem = { 
      ...item, 
      id, 
      imageUrl: item.imageUrl || null,
      isAvailable: true,
      createdAt: new Date()
    };
    this.marketplaceItems.set(id, newItem);
    return newItem;
  }

  // Barter operations
  async getBarterOffers(): Promise<BarterOffer[]> {
    return Array.from(this.barterOffers.values());
  }

  async getBarterOfferById(id: number): Promise<BarterOffer | undefined> {
    return this.barterOffers.get(id);
  }

  async getBarterOffersByUserId(userId: number): Promise<BarterOffer[]> {
    return Array.from(this.barterOffers.values()).filter(
      (offer) => offer.offerUserId === userId || offer.receiveUserId === userId,
    );
  }

  async createBarterOffer(offer: InsertBarterOffer): Promise<BarterOffer> {
    const id = this.barterOfferId++;
    const newOffer: BarterOffer = { 
      ...offer, 
      id, 
      status: "pending",
      createdAt: new Date()
    };
    this.barterOffers.set(id, newOffer);
    return newOffer;
  }

  async updateBarterOfferStatus(id: number, status: string): Promise<BarterOffer | undefined> {
    const offer = this.barterOffers.get(id);
    if (!offer) return undefined;
    
    const updatedOffer = { ...offer, status };
    this.barterOffers.set(id, updatedOffer);
    return updatedOffer;
  }

  // Microjob operations
  async getMicrojobs(): Promise<Microjob[]> {
    return Array.from(this.microjobs.values());
  }

  async getMicrojobById(id: number): Promise<Microjob | undefined> {
    return this.microjobs.get(id);
  }

  async getMicrojobsByUserId(userId: number): Promise<Microjob[]> {
    return Array.from(this.microjobs.values()).filter(
      (job) => job.userId === userId,
    );
  }

  async createMicrojob(job: InsertMicrojob): Promise<Microjob> {
    const id = this.microjobId++;
    const newJob: Microjob = { 
      ...job, 
      id, 
      status: "open",
      createdAt: new Date()
    };
    this.microjobs.set(id, newJob);
    return newJob;
  }

  async updateMicrojobStatus(id: number, status: string): Promise<Microjob | undefined> {
    const job = this.microjobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, status };
    this.microjobs.set(id, updatedJob);
    return updatedJob;
  }

  // DAO Proposal operations
  async getDaoProposals(): Promise<DaoProposal[]> {
    return Array.from(this.daoProposals.values());
  }

  async getDaoProposalById(id: number): Promise<DaoProposal | undefined> {
    return this.daoProposals.get(id);
  }

  async createDaoProposal(proposal: InsertDaoProposal): Promise<DaoProposal> {
    const id = this.daoProposalId++;
    const newProposal: DaoProposal = { 
      ...proposal, 
      id, 
      votesFor: 0,
      votesAgainst: 0,
      status: "active",
      createdAt: new Date()
    };
    this.daoProposals.set(id, newProposal);
    return newProposal;
  }

  async voteOnProposal(id: number, vote: "for" | "against"): Promise<DaoProposal | undefined> {
    const proposal = this.daoProposals.get(id);
    if (!proposal) return undefined;
    
    const updatedProposal = { 
      ...proposal, 
      votesFor: vote === "for" ? proposal.votesFor + 1 : proposal.votesFor,
      votesAgainst: vote === "against" ? proposal.votesAgainst + 1 : proposal.votesAgainst
    };
    
    // Check if proposal should be closed based on votes
    if (updatedProposal.votesFor > updatedProposal.votesAgainst && 
        updatedProposal.votesFor > 10) {  // Simple threshold for demo
      updatedProposal.status = "passed";
    } else if (updatedProposal.votesAgainst > updatedProposal.votesFor && 
               updatedProposal.votesAgainst > 10) {
      updatedProposal.status = "rejected";
    }
    
    this.daoProposals.set(id, updatedProposal);
    return updatedProposal;
  }

  // Initialize with some demo data
  private initializeDemoData() {
    // Add demo users
    const user1 = this.createUser({
      username: "farmer_john",
      password: "password123",
      fullName: "John Farmer",
      userType: "farmer",
      location: "Rural County, Midwest",
      walletAddress: "0x1234567890abcdef",
      bio: "Third-generation farmer specializing in sustainable agriculture",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
    });

    const user2 = this.createUser({
      username: "agro_corp",
      password: "password123",
      fullName: "AgriTech Industries",
      userType: "industry",
      location: "Tech Valley, CA",
      walletAddress: "0x0987654321fedcba",
      bio: "Developing cutting-edge solutions for agricultural challenges",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
    });

    const user3 = this.createUser({
      username: "gov_agriculture",
      password: "password123",
      fullName: "Department of Agriculture",
      userType: "government",
      location: "Capital City",
      walletAddress: "0xabcdef1234567890",
      bio: "Official government agriculture department",
      profileImage: "https://randomuser.me/api/portraits/men/3.jpg"
    });

    // We'll need to resolve these promises for the demo data
    Promise.all([user1, user2, user3]).then(([u1, u2, u3]) => {
      // Add marketplace items
      this.createMarketplaceItem({
        userId: u1.id,
        title: "Organic Tomato Seeds",
        description: "Heirloom variety, perfect for sustainable farming",
        category: "seed",
        price: 25.99,
        unit: "kg",
        quantity: 50,
        location: "Rural County, Midwest",
        imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b"
      });

      this.createMarketplaceItem({
        userId: u1.id,
        title: "Wheat Harvest Surplus",
        description: "Excess wheat from this season's bumper crop",
        category: "produce",
        price: 199.99,
        unit: "ton",
        quantity: 5,
        location: "Rural County, Midwest",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d73c3ed144"
      });

      this.createMarketplaceItem({
        userId: u2.id,
        title: "Modern Irrigation System",
        description: "Water-efficient drip irrigation technology",
        category: "tool",
        price: 1299.99,
        unit: "piece",
        quantity: 10,
        location: "Tech Valley, CA",
        imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854"
      });

      this.createMarketplaceItem({
        userId: u1.id,
        title: "Composted Farm Waste",
        description: "Nutrient-rich compost from agricultural waste",
        category: "agri-waste",
        price: 15.50,
        unit: "kg",
        quantity: 1000,
        location: "Rural County, Midwest",
        imageUrl: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8"
      });

      // Add microjobs
      this.createMicrojob({
        userId: u1.id,
        title: "Seasonal Harvest Help Needed",
        description: "Looking for workers to help with the corn harvest",
        skillsRequired: "Physical strength, basic farming knowledge",
        compensation: 20.50,
        location: "Rural County, Midwest",
        duration: "2 weeks"
      });

      this.createMicrojob({
        userId: u2.id,
        title: "Agricultural Data Analyst",
        description: "Help analyze crop yield data for optimizing production",
        skillsRequired: "Data analysis, agricultural knowledge",
        compensation: 35.75,
        location: "Remote",
        duration: "1 month"
      });

      // Add DAO proposals
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);

      this.createDaoProposal({
        userId: u1.id,
        title: "Community Seed Bank Creation",
        description: "Establish a community-owned seed bank to preserve heirloom varieties and ensure seed sovereignty for local farmers.",
        endsAt: futureDate
      });

      this.createDaoProposal({
        userId: u3.id,
        title: "Sustainable Farming Incentive Program",
        description: "Create a token-based incentive system to reward farmers who adopt sustainable practices.",
        endsAt: futureDate
      });
      
      // Add liquidity pools
      this.createLiquidityPool({
        name: "Wheat Collective Pool",
        description: "Farmers' collective liquidity pool for wheat harvests",
        poolType: "yield",
        totalLiquidity: 50000,
        asset: "wheat",
        apy: 5.75,
        participants: 25,
        risk: "low",
        duration: "6 months",
        userId: u1.id,
        imageUrl: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c"
      });
      
      this.createLiquidityPool({
        name: "Rice Growers Association",
        description: "Collective liquidity for small rice farmers",
        poolType: "lending",
        totalLiquidity: 75000,
        asset: "rice",
        apy: 6.25,
        participants: 35,
        risk: "medium",
        duration: "12 months",
        userId: u2.id,
        imageUrl: "https://images.unsplash.com/photo-1536304447766-da0ed4ce1b73"
      });
      
      this.createLiquidityPool({
        name: "Innovative Farm Tech Fund",
        description: "High-yield pool for agricultural innovation",
        poolType: "yield",
        totalLiquidity: 125000,
        asset: "mixed",
        apy: 8.5,
        participants: 12,
        risk: "high",
        duration: "24 months",
        userId: u3.id,
        imageUrl: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a"
      });
    });
  }
}

import { DatabaseStorage } from './database-storage';

// Use either MemStorage or DatabaseStorage based on environment
export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
