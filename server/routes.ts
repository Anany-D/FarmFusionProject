import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMarketplaceItemSchema, 
  insertBarterOfferSchema,
  insertMicrojobSchema,
  insertDaoProposalSchema,
  insertLiquidityPoolSchema
} from '@shared/schema';
import { z } from 'zod';

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // User Routes
  app.post('/api/users', async (req, res) => {
    try {
      const validData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Marketplace Routes
  app.get('/api/marketplace', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const items = await storage.getMarketplaceItemsByCategory(category);
        return res.json(items);
      }
      
      const items = await storage.getMarketplaceItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get marketplace items" });
    }
  });

  app.get('/api/marketplace/:id', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await storage.getMarketplaceItemById(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to get marketplace item" });
    }
  });

  app.post('/api/marketplace', async (req, res) => {
    try {
      const validData = insertMarketplaceItemSchema.parse(req.body);
      const item = await storage.createMarketplaceItem(validData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create marketplace item" });
      }
    }
  });

  // Barter Routes
  app.get('/api/barter', async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (userId) {
        const offers = await storage.getBarterOffersByUserId(userId);
        return res.json(offers);
      }
      
      const offers = await storage.getBarterOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get barter offers" });
    }
  });

  app.get('/api/barter/:id', async (req, res) => {
    try {
      const offerId = parseInt(req.params.id);
      const offer = await storage.getBarterOfferById(offerId);
      if (!offer) {
        return res.status(404).json({ message: "Barter offer not found" });
      }
      res.json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to get barter offer" });
    }
  });

  app.post('/api/barter', async (req, res) => {
    try {
      const validData = insertBarterOfferSchema.parse(req.body);
      const offer = await storage.createBarterOffer(validData);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create barter offer" });
      }
    }
  });

  app.patch('/api/barter/:id/status', async (req, res) => {
    try {
      const offerId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedOffer = await storage.updateBarterOfferStatus(offerId, status);
      if (!updatedOffer) {
        return res.status(404).json({ message: "Barter offer not found" });
      }
      
      res.json(updatedOffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update barter offer status" });
    }
  });

  // Microjob Routes
  app.get('/api/microjobs', async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (userId) {
        const jobs = await storage.getMicrojobsByUserId(userId);
        return res.json(jobs);
      }
      
      const jobs = await storage.getMicrojobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get microjobs" });
    }
  });

  app.get('/api/microjobs/:id', async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getMicrojobById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Microjob not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to get microjob" });
    }
  });

  app.post('/api/microjobs', async (req, res) => {
    try {
      const validData = insertMicrojobSchema.parse(req.body);
      const job = await storage.createMicrojob(validData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create microjob" });
      }
    }
  });

  app.patch('/api/microjobs/:id/status', async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['open', 'assigned', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const updatedJob = await storage.updateMicrojobStatus(jobId, status);
      if (!updatedJob) {
        return res.status(404).json({ message: "Microjob not found" });
      }
      
      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Failed to update microjob status" });
    }
  });

  // DAO Proposal Routes
  app.get('/api/dao/proposals', async (req, res) => {
    try {
      const proposals = await storage.getDaoProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get DAO proposals" });
    }
  });

  app.get('/api/dao/proposals/:id', async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getDaoProposalById(proposalId);
      if (!proposal) {
        return res.status(404).json({ message: "DAO proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to get DAO proposal" });
    }
  });

  app.post('/api/dao/proposals', async (req, res) => {
    try {
      const validData = insertDaoProposalSchema.parse(req.body);
      const proposal = await storage.createDaoProposal(validData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create DAO proposal" });
      }
    }
  });

  app.post('/api/dao/proposals/:id/vote', async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const { vote } = req.body;
      
      if (!vote || !['for', 'against'].includes(vote)) {
        return res.status(400).json({ message: "Invalid vote value" });
      }
      
      const updatedProposal = await storage.voteOnProposal(proposalId, vote as "for" | "against");
      if (!updatedProposal) {
        return res.status(404).json({ message: "DAO proposal not found" });
      }
      
      res.json(updatedProposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to vote on proposal" });
    }
  });

  // Liquidity Pool Routes
  app.get('/api/liquidity/pools', async (req, res) => {
    try {
      const risk = req.query.risk as string | undefined;
      const pools = await storage.getLiquidityPools(risk);
      res.json(pools);
    } catch (error) {
      res.status(500).json({ message: "Failed to get liquidity pools" });
    }
  });

  app.get('/api/liquidity/pools/:id', async (req, res) => {
    try {
      const poolId = parseInt(req.params.id);
      const pool = await storage.getLiquidityPoolById(poolId);
      if (!pool) {
        return res.status(404).json({ message: "Liquidity pool not found" });
      }
      res.json(pool);
    } catch (error) {
      res.status(500).json({ message: "Failed to get liquidity pool" });
    }
  });

  app.post('/api/liquidity/pools', async (req, res) => {
    try {
      const validData = insertLiquidityPoolSchema.parse(req.body);
      const pool = await storage.createLiquidityPool(validData);
      res.status(201).json(pool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create liquidity pool" });
      }
    }
  });

  return httpServer;
}
