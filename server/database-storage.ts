import { eq, and, like, or } from 'drizzle-orm';
import { db } from './db';
import {
  users, User, InsertUser,
  marketplaceItems, MarketplaceItem, InsertMarketplaceItem,
  barterOffers, BarterOffer, InsertBarterOffer,
  microjobs, Microjob, InsertMicrojob,
  daoProposals, DaoProposal, InsertDaoProposal,
  liquidityPools, LiquidityPool, InsertLiquidityPool
} from "@shared/schema";
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Marketplace operations
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return db.select().from(marketplaceItems);
  }

  async getMarketplaceItemById(id: number): Promise<MarketplaceItem | undefined> {
    const [item] = await db.select().from(marketplaceItems).where(eq(marketplaceItems.id, id));
    return item;
  }

  async getMarketplaceItemsByUserId(userId: number): Promise<MarketplaceItem[]> {
    return db.select().from(marketplaceItems).where(eq(marketplaceItems.userId, userId));
  }

  async getMarketplaceItemsByCategory(category: string): Promise<MarketplaceItem[]> {
    return db.select().from(marketplaceItems).where(eq(marketplaceItems.category, category));
  }

  async createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const [marketplaceItem] = await db.insert(marketplaceItems).values(item).returning();
    return marketplaceItem;
  }

  // Barter operations
  async getBarterOffers(): Promise<BarterOffer[]> {
    return db.select().from(barterOffers);
  }

  async getBarterOfferById(id: number): Promise<BarterOffer | undefined> {
    const [offer] = await db.select().from(barterOffers).where(eq(barterOffers.id, id));
    return offer;
  }

  async getBarterOffersByUserId(userId: number): Promise<BarterOffer[]> {
    return db.select().from(barterOffers).where(
      or(
        eq(barterOffers.offerUserId, userId),
        eq(barterOffers.receiveUserId, userId)
      )
    );
  }

  async createBarterOffer(offer: InsertBarterOffer): Promise<BarterOffer> {
    const [barterOffer] = await db.insert(barterOffers).values({
      ...offer,
      status: "pending"
    }).returning();
    return barterOffer;
  }

  async updateBarterOfferStatus(id: number, status: string): Promise<BarterOffer | undefined> {
    const [updatedOffer] = await db
      .update(barterOffers)
      .set({ status })
      .where(eq(barterOffers.id, id))
      .returning();
    return updatedOffer;
  }

  // Microjob operations
  async getMicrojobs(): Promise<Microjob[]> {
    return db.select().from(microjobs);
  }

  async getMicrojobById(id: number): Promise<Microjob | undefined> {
    const [job] = await db.select().from(microjobs).where(eq(microjobs.id, id));
    return job;
  }

  async getMicrojobsByUserId(userId: number): Promise<Microjob[]> {
    return db.select().from(microjobs).where(eq(microjobs.userId, userId));
  }

  async createMicrojob(job: InsertMicrojob): Promise<Microjob> {
    const [microjob] = await db.insert(microjobs).values({
      ...job,
      status: "open"
    }).returning();
    return microjob;
  }

  async updateMicrojobStatus(id: number, status: string): Promise<Microjob | undefined> {
    const [updatedJob] = await db
      .update(microjobs)
      .set({ status })
      .where(eq(microjobs.id, id))
      .returning();
    return updatedJob;
  }

  // DAO Proposal operations
  async getDaoProposals(): Promise<DaoProposal[]> {
    return db.select().from(daoProposals);
  }

  async getDaoProposalById(id: number): Promise<DaoProposal | undefined> {
    const [proposal] = await db.select().from(daoProposals).where(eq(daoProposals.id, id));
    return proposal;
  }

  async createDaoProposal(proposal: InsertDaoProposal): Promise<DaoProposal> {
    const [daoProposal] = await db.insert(daoProposals).values({
      ...proposal,
      votesFor: 0,
      votesAgainst: 0,
      status: "active"
    }).returning();
    return daoProposal;
  }

  async voteOnProposal(id: number, vote: "for" | "against"): Promise<DaoProposal | undefined> {
    // First get the current proposal
    const [proposal] = await db.select().from(daoProposals).where(eq(daoProposals.id, id));
    if (!proposal) return undefined;
    
    // Update vote counts
    const votesFor = vote === "for" ? proposal.votesFor + 1 : proposal.votesFor;
    const votesAgainst = vote === "against" ? proposal.votesAgainst + 1 : proposal.votesAgainst;
    
    // Determine if the proposal status should change
    let status = proposal.status;
    if (votesFor > votesAgainst && votesFor > 10) {
      status = "passed";
    } else if (votesAgainst > votesFor && votesAgainst > 10) {
      status = "rejected";
    }
    
    // Update the proposal
    const [updatedProposal] = await db
      .update(daoProposals)
      .set({ votesFor, votesAgainst, status })
      .where(eq(daoProposals.id, id))
      .returning();
    
    return updatedProposal;
  }

  // Liquidity Pool operations
  async getLiquidityPools(risk?: string): Promise<LiquidityPool[]> {
    if (risk) {
      return db.select().from(liquidityPools).where(eq(liquidityPools.risk, risk));
    }
    return db.select().from(liquidityPools);
  }

  async getLiquidityPoolById(id: number): Promise<LiquidityPool | undefined> {
    const [pool] = await db.select().from(liquidityPools).where(eq(liquidityPools.id, id));
    return pool;
  }

  async createLiquidityPool(pool: InsertLiquidityPool): Promise<LiquidityPool> {
    const [liquidityPool] = await db.insert(liquidityPools).values(pool).returning();
    return liquidityPool;
  }
}