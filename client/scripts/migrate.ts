import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../server/db";
import { users, marketplaceItems, barterOffers, microjobs, daoProposals, liquidityPools } from "../shared/schema";

async function main() {
  console.log("Running migrations...");
  
  // Create tables directly from schema
  try {
    // Push schema to the database
    console.log("Pushing schema to database...");
    
    // Create users table
    console.log("Creating users table...");
    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      user_type TEXT NOT NULL,
      location TEXT NOT NULL,
      wallet_address TEXT,
      bio TEXT,
      profile_image TEXT,
      verified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create marketplace_items table
    console.log("Creating marketplace_items table...");
    await db.execute(`CREATE TABLE IF NOT EXISTS marketplace_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      unit TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      location TEXT NOT NULL,
      image_url TEXT,
      is_available BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create barter_offers table
    console.log("Creating barter_offers table...");
    await db.execute(`CREATE TABLE IF NOT EXISTS barter_offers (
      id SERIAL PRIMARY KEY,
      offer_user_id INTEGER NOT NULL,
      receive_user_id INTEGER NOT NULL,
      offer_item_id INTEGER NOT NULL,
      receive_item_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create microjobs table
    console.log("Creating microjobs table...");
    await db.execute(`CREATE TABLE IF NOT EXISTS microjobs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      skills_required TEXT NOT NULL,
      compensation DOUBLE PRECISION NOT NULL,
      location TEXT NOT NULL,
      duration TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create dao_proposals table
    console.log("Creating dao_proposals table...");
    await db.execute(`CREATE TABLE IF NOT EXISTS dao_proposals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      votes_for INTEGER NOT NULL DEFAULT 0,
      votes_against INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      ends_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create liquidity_pools table
    console.log("Creating liquidity_pools table...");
    await db.execute(`CREATE TABLE IF NOT EXISTS liquidity_pools (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      pool_type TEXT NOT NULL,
      total_liquidity DOUBLE PRECISION NOT NULL,
      asset TEXT NOT NULL,
      apy DOUBLE PRECISION NOT NULL,
      participants INTEGER NOT NULL,
      risk TEXT NOT NULL,
      duration TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    console.log("Migration completed successfully!");
    
    // Seed data
    console.log("Seeding initial data...");
    await seedInitialData();
    
    console.log("All done!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

async function seedInitialData() {
  try {
    // Check if users table is empty
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Skipping seed data - database already has data");
      return;
    }
    
    // Create demo users
    console.log("Creating demo users...");
    const [user1] = await db.insert(users).values({
      username: "farmer_john",
      password: "password123",
      fullName: "John Farmer",
      userType: "farmer",
      location: "Rural County, Midwest",
      walletAddress: "0x1234567890abcdef",
      bio: "Third-generation farmer specializing in sustainable agriculture",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      verified: false
    }).returning();
    
    const [user2] = await db.insert(users).values({
      username: "agro_corp",
      password: "password123",
      fullName: "AgriTech Industries",
      userType: "industry",
      location: "Tech Valley, CA",
      walletAddress: "0x0987654321fedcba",
      bio: "Developing cutting-edge solutions for agricultural challenges",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      verified: false
    }).returning();
    
    const [user3] = await db.insert(users).values({
      username: "gov_agriculture",
      password: "password123",
      fullName: "Department of Agriculture",
      userType: "government",
      location: "Capital City",
      walletAddress: "0xabcdef1234567890",
      bio: "Official government agriculture department",
      profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
      verified: false
    }).returning();
    
    // Create marketplace items
    console.log("Creating marketplace items...");
    await db.insert(marketplaceItems).values({
      userId: user1.id,
      title: "Organic Tomato Seeds",
      description: "Heirloom variety, perfect for sustainable farming",
      category: "seed",
      price: 25.99,
      unit: "kg",
      quantity: 50,
      location: "Rural County, Midwest",
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b",
      isAvailable: true
    });
    
    await db.insert(marketplaceItems).values({
      userId: user1.id,
      title: "Wheat Harvest Surplus",
      description: "Excess wheat from this season's bumper crop",
      category: "produce",
      price: 199.99,
      unit: "ton",
      quantity: 5,
      location: "Rural County, Midwest",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d73c3ed144",
      isAvailable: true
    });
    
    await db.insert(marketplaceItems).values({
      userId: user2.id,
      title: "Modern Irrigation System",
      description: "Water-efficient drip irrigation technology",
      category: "tool",
      price: 1299.99,
      unit: "piece",
      quantity: 10,
      location: "Tech Valley, CA",
      imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
      isAvailable: true
    });
    
    // Create microjobs
    console.log("Creating microjobs...");
    await db.insert(microjobs).values({
      userId: user1.id,
      title: "Seasonal Harvest Help Needed",
      description: "Looking for workers to help with the corn harvest",
      skillsRequired: "Physical strength, basic farming knowledge",
      compensation: 20.50,
      location: "Rural County, Midwest",
      duration: "2 weeks",
      status: "open"
    });
    
    await db.insert(microjobs).values({
      userId: user2.id,
      title: "Agricultural Data Analyst",
      description: "Help analyze crop yield data for optimizing production",
      skillsRequired: "Data analysis, agricultural knowledge",
      compensation: 35.75,
      location: "Remote",
      duration: "1 month",
      status: "open"
    });
    
    // Create DAO proposals
    console.log("Creating DAO proposals...");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    
    await db.insert(daoProposals).values({
      userId: user1.id,
      title: "Community Seed Bank Creation",
      description: "Establish a community-owned seed bank to preserve heirloom varieties and ensure seed sovereignty for local farmers.",
      votesFor: 0,
      votesAgainst: 0,
      status: "active",
      endsAt: futureDate
    });
    
    await db.insert(daoProposals).values({
      userId: user3.id,
      title: "Sustainable Farming Incentive Program",
      description: "Create a token-based incentive system to reward farmers who adopt sustainable practices.",
      votesFor: 0,
      votesAgainst: 0,
      status: "active",
      endsAt: futureDate
    });
    
    // Create liquidity pools
    console.log("Creating liquidity pools...");
    await db.insert(liquidityPools).values({
      name: "Wheat Collective Pool",
      description: "Farmers' collective liquidity pool for wheat harvests",
      poolType: "yield",
      totalLiquidity: 50000,
      asset: "wheat",
      apy: 5.75,
      participants: 25,
      risk: "low",
      duration: "6 months",
      userId: user1.id,
      imageUrl: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c"
    });
    
    await db.insert(liquidityPools).values({
      name: "Rice Growers Association",
      description: "Collective liquidity for small rice farmers",
      poolType: "lending",
      totalLiquidity: 75000,
      asset: "rice",
      apy: 6.25,
      participants: 35,
      risk: "medium",
      duration: "12 months",
      userId: user2.id,
      imageUrl: "https://images.unsplash.com/photo-1536304447766-da0ed4ce1b73"
    });
    
    await db.insert(liquidityPools).values({
      name: "Innovative Farm Tech Fund",
      description: "High-yield pool for agricultural innovation",
      poolType: "yield",
      totalLiquidity: 125000,
      asset: "mixed",
      apy: 8.5,
      participants: 12,
      risk: "high",
      duration: "24 months",
      userId: user3.id,
      imageUrl: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a"
    });
    
    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Seeding data failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });