import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { galleryPhotos, performers, performerRatings, pressArticles } from "@shared/schema";
import { insertPerformerSchema, insertVideoSchema, insertPerformanceSchema, insertContentSchema, insertGalleryPhotoSchema, insertPerformerRatingSchema, insertPressArticleSchema } from "@shared/schema";
import { z } from "zod";
import { eq, avg, count, sql } from "drizzle-orm";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Object storage routes for image uploads
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      console.log("Upload request received from user:", (req.user as any)?.claims?.sub);
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      console.log("Generated upload URL:", uploadURL);
      console.log("Sending response:", { uploadURL });
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });
  // Performers routes
  app.get("/api/performers", async (req, res) => {
    try {
      const performers = await storage.getPerformers();
      res.json(performers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performers" });
    }
  });

  app.get("/api/performers/current", async (req, res) => {
    try {
      const performers = await storage.getCurrentPerformers();
      res.json(performers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch current performers" });
    }
  });

  app.get("/api/performers/featured", async (req, res) => {
    try {
      const performers = await storage.getFeaturedPerformers();
      
      // Randomly select up to 6 featured performers
      const shuffled = performers.sort(() => Math.random() - 0.5);
      const selectedPerformers = shuffled.slice(0, 6);
      
      res.json(selectedPerformers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured performers" });
    }
  });

  app.get("/api/performers/:id", async (req, res) => {
    try {
      const performer = await storage.getPerformer(req.params.id);
      if (!performer) {
        return res.status(404).json({ error: "Performer not found" });
      }
      res.json(performer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performer" });
    }
  });

  app.post("/api/performers", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating performer request body:", req.body);
      
      // Check current performer count first
      const currentPerformers = await storage.getPerformers();
      console.log(`Current performer count: ${currentPerformers.length}`);
      
      // Transform date strings to Date objects if needed
      const processedData = {
        ...req.body,
        performingSince: req.body.performingSince ? new Date(req.body.performingSince) : undefined,
        performingUntil: req.body.performingUntil ? new Date(req.body.performingUntil) : undefined,
      };
      
      const validatedData = insertPerformerSchema.parse(processedData);
      console.log("Validated performer data:", validatedData);
      
      const performer = await storage.createPerformer(validatedData);
      console.log("Performer created successfully:", performer.id);
      
      res.status(201).json(performer);
    } catch (error) {
      console.error("Error creating performer:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace available');
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          res.status(409).json({ error: "A performer with this name already exists" });
        } else if (error.message.includes('database') || error.message.includes('connection')) {
          res.status(503).json({ error: "Database connection error. Please try again." });
        } else if (error.message.includes('validation')) {
          res.status(400).json({ error: "Invalid performer data: " + error.message });
        } else {
          res.status(500).json({ error: "Server error: " + error.message });
        }
      } else {
        res.status(500).json({ error: "Unknown error occurred: " + JSON.stringify(error) });
      }
    }
  });

  app.put("/api/performers/:id", isAuthenticated, async (req, res) => {
    try {
      // Transform date strings to Date objects if needed
      const processedData = {
        ...req.body,
        performingSince: req.body.performingSince ? new Date(req.body.performingSince) : undefined,
        performingUntil: req.body.performingUntil ? new Date(req.body.performingUntil) : undefined,
      };
      
      const validatedData = insertPerformerSchema.partial().parse(processedData);
      const performer = await storage.updatePerformer(req.params.id, validatedData);
      if (!performer) {
        return res.status(404).json({ error: "Performer not found" });
      }
      res.json(performer);
    } catch (error) {
      res.status(400).json({ error: "Invalid performer data" });
    }
  });

  app.delete("/api/performers/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deletePerformer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Performer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete performer" });
    }
  });

  // Videos routes
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/featured", async (req, res) => {
    try {
      const videos = await storage.getFeaturedVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const video = await storage.getVideo(req.params.id);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ error: "Invalid video data" });
    }
  });

  app.put("/api/videos/:id", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(req.params.id, validatedData);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(400).json({ error: "Invalid video data" });
    }
  });

  app.delete("/api/videos/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteVideo(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete video" });
    }
  });

  // Performances routes
  app.get("/api/performances", async (req, res) => {
    try {
      const performances = await storage.getPerformances();
      res.json(performances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performances" });
    }
  });

  app.get("/api/performances/upcoming", async (req, res) => {
    try {
      const performances = await storage.getUpcomingPerformances();
      res.json(performances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming performances" });
    }
  });

  app.get("/api/performances/featured", async (req, res) => {
    try {
      const performances = await storage.getFeaturedPerformances();
      res.json(performances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured performances" });
    }
  });

  app.get("/api/performances/:id", async (req, res) => {
    try {
      const performance = await storage.getPerformance(req.params.id);
      if (!performance) {
        return res.status(404).json({ error: "Performance not found" });
      }
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance" });
    }
  });

  app.post("/api/performances", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating performance request body:", req.body);
      
      // Transform date string to Date object if needed
      const processedData = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      };
      
      console.log("Processed data before validation:", processedData);
      
      const validatedData = insertPerformanceSchema.parse(processedData);
      console.log("Validated performance data:", validatedData);
      
      const performance = await storage.createPerformance(validatedData);
      console.log("Performance created successfully:", performance.id);
      
      res.status(201).json(performance);
    } catch (error) {
      console.error("Error creating performance:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace available');
      
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ 
          error: "Validation failed",
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
            received: err.received
          }))
        });
      } else if (error instanceof Error) {
        if (error.message.includes('database') || error.message.includes('connection')) {
          res.status(503).json({ error: "Database connection error. Please try again." });
        } else {
          res.status(500).json({ error: "Server error: " + error.message });
        }
      } else {
        res.status(500).json({ error: "Unknown error occurred: " + JSON.stringify(error) });
      }
    }
  });

  app.put("/api/performances/:id", isAuthenticated, async (req, res) => {
    try {
      // Transform date string to Date object if needed
      const processedData = {
        ...req.body,
        ...(req.body.date && { date: new Date(req.body.date) }),
      };
      
      const validatedData = insertPerformanceSchema.partial().parse(processedData);
      const performance = await storage.updatePerformance(req.params.id, validatedData);
      if (!performance) {
        return res.status(404).json({ error: "Performance not found" });
      }
      res.json(performance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Validation failed",
          details: error.errors 
        });
      } else {
        res.status(500).json({ error: "Failed to update performance" });
      }
    }
  });

  app.delete("/api/performances/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deletePerformance(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Performance not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete performance" });
    }
  });

  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:key", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.key);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createOrUpdateContent(validatedData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  // Endpoint for processing performer images after upload
  app.put("/api/performer-images", isAuthenticated, async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = (req.user as any)?.claims?.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting performer image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/gallery-images", isAuthenticated, async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting gallery image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/press-images", isAuthenticated, async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting press image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Gallery Photos routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const photos = await storage.getGalleryPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery photos" });
    }
  });

  app.get("/api/gallery/featured", async (req, res) => {
    try {
      const photos = await storage.getFeaturedGalleryPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured gallery photos" });
    }
  });

  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const photo = await storage.getGalleryPhoto(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: "Gallery photo not found" });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery photo" });
    }
  });

  app.post("/api/gallery", isAuthenticated, async (req, res) => {
    try {
      console.log("Gallery POST request body:", JSON.stringify(req.body, null, 2));
      
      // Parse showDate string to Date if provided
      const requestData = { ...req.body };
      if (requestData.showDate && typeof requestData.showDate === 'string') {
        requestData.showDate = new Date(requestData.showDate);
      }
      
      const validatedData = insertGalleryPhotoSchema.parse(requestData);
      const photo = await storage.createGalleryPhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      console.error("Gallery validation error:", error);
      res.status(400).json({ 
        error: "Invalid gallery photo data", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put("/api/gallery/:id", isAuthenticated, async (req, res) => {
    try {
      // Parse showDate string to Date if provided
      const requestData = { ...req.body };
      if (requestData.showDate && typeof requestData.showDate === 'string') {
        requestData.showDate = new Date(requestData.showDate);
      }
      
      const validatedData = insertGalleryPhotoSchema.partial().parse(requestData);
      const photo = await storage.updateGalleryPhoto(req.params.id, validatedData);
      if (!photo) {
        return res.status(404).json({ error: "Gallery photo not found" });
      }
      res.json(photo);
    } catch (error) {
      res.status(400).json({ error: "Invalid gallery photo data" });
    }
  });

  app.delete("/api/gallery/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteGalleryPhoto(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Gallery photo not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gallery photo" });
    }
  });

  // Track gallery photo views
  app.post("/api/gallery/:id/view", async (req, res) => {
    try {
      await db.update(galleryPhotos)
        .set({ views: sql`COALESCE(views, 0) + 1` })
        .where(eq(galleryPhotos.id, req.params.id));
      
      const result = await db.select({ views: galleryPhotos.views })
        .from(galleryPhotos)
        .where(eq(galleryPhotos.id, req.params.id));
      
      res.status(200).json({ 
        success: true, 
        views: result[0]?.views || 0 
      });
    } catch (error) {
      console.error("Error tracking photo view:", error);
      res.status(500).json({ error: "Failed to track view" });
    }
  });

  // Rate performer
  app.post("/api/performers/:id/rate", async (req, res) => {
    try {
      const { rating } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }

      const performerId = req.params.id;
      const userId = (req.user as any)?.claims?.sub || null;
      const sessionId = req.session?.id || `anon-${Date.now()}`;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

      // Check for existing rating from this user/session to prevent spam
      let existingCheck;
      if (userId) {
        // If authenticated, check by user ID
        existingCheck = await db.select({ id: performerRatings.id })
          .from(performerRatings)
          .where(sql`${performerRatings.performerId} = ${performerId} AND ${performerRatings.userId} = ${userId}`);
      } else {
        // If anonymous, check by session ID within 24 hours for spam protection
        existingCheck = await db.select({ id: performerRatings.id })
          .from(performerRatings)
          .where(sql`${performerRatings.performerId} = ${performerId} AND ${performerRatings.sessionId} = ${sessionId} AND ${performerRatings.createdAt} > NOW() - INTERVAL '24 hours'`);
      }

      if (existingCheck.length > 0) {
        return res.status(429).json({ error: "You have already rated this performer" });
      }

      // Insert rating using Drizzle with proper parameterization
      await db.insert(performerRatings).values({
        performerId,
        userId: userId || null,
        sessionId,
        rating,
      });

      // Calculate new average and count using Drizzle aggregation
      const avgResult = await db.select({
        avgRating: avg(performerRatings.rating),
        ratingCount: count(performerRatings.rating)
      })
      .from(performerRatings)
      .where(eq(performerRatings.performerId, performerId));

      const stats = avgResult[0];
      const avgRating = parseFloat(stats?.avgRating || "0");
      const ratingCount = parseInt(stats?.ratingCount?.toString() || "0");

      // Update performer average rating using Drizzle
      await db.update(performers)
        .set({ 
          rating: avgRating,
          ratingCount: ratingCount 
        })
        .where(eq(performers.id, performerId));
      
      res.json({
        averageRating: avgRating,
        ratingCount: ratingCount,
      });
    } catch (error) {
      console.error("Error rating performer:", error);
      res.status(500).json({ error: "Failed to submit rating" });
    }
  });

  // Press articles routes
  app.get("/api/press", async (req, res) => {
    try {
      const articles = await db.select().from(pressArticles).orderBy(sql`${pressArticles.publishedDate} DESC NULLS LAST, ${pressArticles.createdAt} DESC`);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching press articles:", error);
      res.status(500).json({ error: "Failed to fetch press articles" });
    }
  });

  app.get("/api/press/featured", async (req, res) => {
    try {
      const articles = await db.select()
        .from(pressArticles)
        .where(eq(pressArticles.featured, true))
        .orderBy(sql`${pressArticles.publishedDate} DESC NULLS LAST, ${pressArticles.createdAt} DESC`)
        .limit(3);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching featured press articles:", error);
      res.status(500).json({ error: "Failed to fetch featured press articles" });
    }
  });

  app.get("/api/press/:id", async (req, res) => {
    try {
      const [article] = await db.select().from(pressArticles).where(eq(pressArticles.id, req.params.id));
      if (!article) {
        return res.status(404).json({ error: "Press article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching press article:", error);
      res.status(500).json({ error: "Failed to fetch press article" });
    }
  });

  app.post("/api/press", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPressArticleSchema.parse(req.body);
      const [article] = await db.insert(pressArticles).values(validatedData).returning();
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating press article:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid article data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create press article" });
    }
  });

  app.put("/api/press/:id", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPressArticleSchema.parse(req.body);
      const [article] = await db.update(pressArticles)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(pressArticles.id, req.params.id))
        .returning();
      
      if (!article) {
        return res.status(404).json({ error: "Press article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error updating press article:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid article data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update press article" });
    }
  });

  app.delete("/api/press/:id", isAuthenticated, async (req, res) => {
    try {
      const [deletedArticle] = await db.delete(pressArticles)
        .where(eq(pressArticles.id, req.params.id))
        .returning();
      
      if (!deletedArticle) {
        return res.status(404).json({ error: "Press article not found" });
      }
      res.json({ message: "Press article deleted successfully" });
    } catch (error) {
      console.error("Error deleting press article:", error);
      res.status(500).json({ error: "Failed to delete press article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
