import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPerformerSchema, insertVideoSchema, insertPerformanceSchema, insertContentSchema, insertGalleryPhotoSchema } from "@shared/schema";
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
      
      const validatedData = insertPerformerSchema.parse(req.body);
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
      const validatedData = insertPerformerSchema.partial().parse(req.body);
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
      
      const validatedData = insertPerformanceSchema.parse(req.body);
      console.log("Validated performance data:", validatedData);
      
      const performance = await storage.createPerformance(validatedData);
      console.log("Performance created successfully:", performance.id);
      
      res.status(201).json(performance);
    } catch (error) {
      console.error("Error creating performance:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace available');
      
      if (error instanceof Error) {
        if (error.message.includes('validation')) {
          res.status(400).json({ error: "Validation error: " + error.message });
        } else if (error.message.includes('database') || error.message.includes('connection')) {
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
      const validatedData = insertPerformanceSchema.partial().parse(req.body);
      const performance = await storage.updatePerformance(req.params.id, validatedData);
      if (!performance) {
        return res.status(404).json({ error: "Performance not found" });
      }
      res.json(performance);
    } catch (error) {
      res.status(400).json({ error: "Invalid performance data" });
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

  const httpServer = createServer(app);
  return httpServer;
}
