import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // farmer, industry, government
  location: text("location").notNull(),
  walletAddress: text("wallet_address"),
  bio: text("bio"),
  verified: boolean("verified").default(false),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  verified: true,
});

// Marketplace Items
export const marketplaceItems = pgTable("marketplace_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // seed, tool, agri-waste, produce
  price: doublePrecision("price").notNull(),
  unit: text("unit").notNull(), // kg, piece, etc.
  quantity: doublePrecision("quantity").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMarketplaceItemSchema = createInsertSchema(marketplaceItems).omit({
  id: true,
  isAvailable: true,
  createdAt: true,
});

// Barter Offers
export const barterOffers = pgTable("barter_offers", {
  id: serial("id").primaryKey(),
  offerUserId: integer("offer_user_id").notNull(),
  receiveUserId: integer("receive_user_id").notNull(),
  offerItemId: integer("offer_item_id").notNull(),
  requestItemId: integer("request_item_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBarterOfferSchema = createInsertSchema(barterOffers).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Microjobs
export const microjobs = pgTable("microjobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  skillsRequired: text("skills_required").notNull(),
  compensation: doublePrecision("compensation").notNull(),
  location: text("location").notNull(),
  duration: text("duration").notNull(),
  status: text("status").notNull().default("open"), // open, assigned, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMicrojobSchema = createInsertSchema(microjobs).omit({
  id: true,
  status: true,
  createdAt: true,
});

// DAO Proposals
export const daoProposals = pgTable("dao_proposals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  votesFor: integer("votes_for").notNull().default(0),
  votesAgainst: integer("votes_against").notNull().default(0),
  status: text("status").notNull().default("active"), // active, passed, rejected
  createdAt: timestamp("created_at").defaultNow(),
  endsAt: timestamp("ends_at").notNull(),
});

export const insertDaoProposalSchema = createInsertSchema(daoProposals).omit({
  id: true,
  votesFor: true,
  votesAgainst: true,
  status: true,
  createdAt: true,
});

// Liquidity Pool model
export const liquidityPools = pgTable("liquidity_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  poolType: text("pool_type").notNull(), // yield, lending, etc.
  totalLiquidity: doublePrecision("total_liquidity").notNull(),
  asset: text("asset").notNull(), // wheat, corn, seed, etc.
  apy: doublePrecision("apy").notNull(),
  participants: integer("participants").notNull(),
  risk: text("risk").notNull(), // low, medium, high
  duration: text("duration").notNull(), // 3 months, 6 months, etc.
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url"),
});

export const insertLiquidityPoolSchema = createInsertSchema(liquidityPools).omit({
  id: true,
  createdAt: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MarketplaceItem = typeof marketplaceItems.$inferSelect;
export type InsertMarketplaceItem = z.infer<typeof insertMarketplaceItemSchema>;

export type BarterOffer = typeof barterOffers.$inferSelect;
export type InsertBarterOffer = z.infer<typeof insertBarterOfferSchema>;

export type Microjob = typeof microjobs.$inferSelect;
export type InsertMicrojob = z.infer<typeof insertMicrojobSchema>;

export type DaoProposal = typeof daoProposals.$inferSelect;
export type InsertDaoProposal = z.infer<typeof insertDaoProposalSchema>;

export type LiquidityPool = typeof liquidityPools.$inferSelect;
export type InsertLiquidityPool = z.infer<typeof insertLiquidityPoolSchema>;
