import { 
  performers, videos, performances, content, users, galleryPhotos,
  type Performer, type InsertPerformer, 
  type Video, type InsertVideo, 
  type Performance, type InsertPerformance, 
  type Content, type InsertContent,
  type User, type UpsertUser,
  type GalleryPhoto, type InsertGalleryPhoto
} from "@shared/schema";
import { db } from "./db";
import { eq, gte } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Performers
  getPerformers(): Promise<Performer[]>;
  getPerformer(id: string): Promise<Performer | undefined>;
  getFeaturedPerformers(): Promise<Performer[]>;
  createPerformer(performer: InsertPerformer): Promise<Performer>;
  updatePerformer(id: string, performer: Partial<InsertPerformer>): Promise<Performer | undefined>;
  deletePerformer(id: string): Promise<boolean>;

  // Videos
  getVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  getFeaturedVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;

  // Performances
  getPerformances(): Promise<Performance[]>;
  getPerformance(id: string): Promise<Performance | undefined>;
  getUpcomingPerformances(): Promise<Performance[]>;
  createPerformance(performance: InsertPerformance): Promise<Performance>;
  updatePerformance(id: string, performance: Partial<InsertPerformance>): Promise<Performance | undefined>;
  deletePerformance(id: string): Promise<boolean>;

  // Content
  getContent(key: string): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  createOrUpdateContent(content: InsertContent): Promise<Content>;

  // Gallery Photos
  getGalleryPhotos(): Promise<GalleryPhoto[]>;
  getGalleryPhoto(id: string): Promise<GalleryPhoto | undefined>;
  getFeaturedGalleryPhotos(): Promise<GalleryPhoto[]>;
  createGalleryPhoto(photo: InsertGalleryPhoto): Promise<GalleryPhoto>;
  updateGalleryPhoto(id: string, photo: Partial<InsertGalleryPhoto>): Promise<GalleryPhoto | undefined>;
  deleteGalleryPhoto(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  // Users (stub implementation for interface compliance)
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const newUser: User = {
      id: user.id || randomUUID(),
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newUser;
  }
  private performers: Map<string, Performer>;
  private videos: Map<string, Video>;
  private performances: Map<string, Performance>;
  private content: Map<string, Content>;
  private galleryPhotos: Map<string, GalleryPhoto>;

  constructor() {
    this.performers = new Map();
    this.videos = new Map();
    this.performances = new Map();
    this.content = new Map();
    this.galleryPhotos = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed performers
    const performer1: Performer = {
      id: randomUUID(),
      name: "Alexander Rivera",
      role: "Principal Dancer",
      bio: "A classically trained dancer with over 12 years of experience, Alexander brings elegance and power to every performance. His background in both classical and contemporary styles makes him a versatile artist who continues to push the boundaries of traditional ballet.",
      imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      galleryImages: [],
      featured: true,
      createdAt: new Date(),
    };

    const performer2: Performer = {
      id: randomUUID(),
      name: "Sebastian Cross",
      role: "Artistic Director",
      bio: "Visionary choreographer and performer who founded the company to push the boundaries of traditional ballet. Sebastian's innovative approach combines classical technique with contemporary expression, creating performances that challenge and inspire.",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      galleryImages: [],
      featured: true,
      createdAt: new Date(),
    };

    const performer3: Performer = {
      id: randomUUID(),
      name: "Dante Valentino",
      role: "Premier Soloist",
      bio: "Known for his graceful technique and emotional depth, Dante captivates audiences with every movement. His performances are characterized by a unique blend of athleticism and artistry that brings stories to life on stage.",
      imageUrl: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      galleryImages: [],
      featured: true,
      createdAt: new Date(),
    };

    this.performers.set(performer1.id, performer1);
    this.performers.set(performer2.id, performer2);
    this.performers.set(performer3.id, performer3);

    // Seed videos
    const video1: Video = {
      id: randomUUID(),
      title: "Swan Lake Reimagined",
      description: "Our groundbreaking interpretation of the classic, featuring stunning choreography and innovative costume design.",
      videoUrl: "https://www.youtube.com/watch?v=9rJoB7y6Ncs",
      thumbnailUrl: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
      featured: true,
      createdAt: new Date(),
    };

    const video2: Video = {
      id: randomUUID(),
      title: "Behind the Scenes",
      description: "Exclusive rehearsal footage showing our artists preparing for their next performance.",
      videoUrl: "https://www.youtube.com/watch?v=b9fmTpudM-4",
      thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      featured: false,
      createdAt: new Date(),
    };

    const video3: Video = {
      id: randomUUID(),
      title: "The Nutcracker",
      description: "Holiday season special featuring our unique interpretation of this beloved classic.",
      videoUrl: "https://www.youtube.com/watch?v=M8J8urC_8Jw",
      thumbnailUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      featured: false,
      createdAt: new Date(),
    };

    this.videos.set(video1.id, video1);
    this.videos.set(video2.id, video2);
    this.videos.set(video3.id, video3);

    // Seed performances
    const performance1: Performance = {
      id: randomUUID(),
      title: "Winter Gala Performance",
      description: "An enchanting evening featuring excerpts from our most beloved productions",
      venue: "Metropolitan Opera House",
      date: new Date("2024-12-15"),
      time: "8:00 PM",
      ticketUrl: "https://www.example.com/tickets",
      createdAt: new Date(),
    };

    const performance2: Performance = {
      id: randomUUID(),
      title: "Contemporary Expressions",
      description: "A modern take on classical themes with innovative choreography",
      venue: "Lincoln Center Theater",
      date: new Date("2025-01-20"),
      time: "7:30 PM",
      ticketUrl: "https://www.example.com/tickets",
      createdAt: new Date(),
    };

    this.performances.set(performance1.id, performance1);
    this.performances.set(performance2.id, performance2);

    // Seed content
    const aboutContent: Content = {
      id: randomUUID(),
      key: "about",
      title: "Redefining Ballet Excellence",
      content: "The Remarkable Mens Ballet company was founded on the principle that artistic expression knows no boundaries. Our performers bring together classical ballet technique with contemporary interpretation, creating performances that celebrate both tradition and innovation.",
      updatedAt: new Date(),
    };

    this.content.set(aboutContent.key, aboutContent);
  }

  // Performers
  async getPerformers(): Promise<Performer[]> {
    return Array.from(this.performers.values());
  }

  async getPerformer(id: string): Promise<Performer | undefined> {
    return this.performers.get(id);
  }

  async getFeaturedPerformers(): Promise<Performer[]> {
    return Array.from(this.performers.values()).filter(p => p.featured);
  }

  async createPerformer(insertPerformer: InsertPerformer): Promise<Performer> {
    const id = randomUUID();
    const performer: Performer = { ...insertPerformer, id, createdAt: new Date() };
    this.performers.set(id, performer);
    return performer;
  }

  async updatePerformer(id: string, updateData: Partial<InsertPerformer>): Promise<Performer | undefined> {
    const performer = this.performers.get(id);
    if (!performer) return undefined;
    
    const updated = { ...performer, ...updateData };
    this.performers.set(id, updated);
    return updated;
  }

  async deletePerformer(id: string): Promise<boolean> {
    return this.performers.delete(id);
  }

  // Videos
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getFeaturedVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(v => v.featured);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { ...insertVideo, id, createdAt: new Date() };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: string, updateData: Partial<InsertVideo>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updated = { ...video, ...updateData };
    this.videos.set(id, updated);
    return updated;
  }

  async deleteVideo(id: string): Promise<boolean> {
    return this.videos.delete(id);
  }

  // Performances
  async getPerformances(): Promise<Performance[]> {
    return Array.from(this.performances.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getPerformance(id: string): Promise<Performance | undefined> {
    return this.performances.get(id);
  }

  async getUpcomingPerformances(): Promise<Performance[]> {
    const now = new Date();
    return Array.from(this.performances.values())
      .filter(p => p.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createPerformance(insertPerformance: InsertPerformance): Promise<Performance> {
    const id = randomUUID();
    const performance: Performance = { ...insertPerformance, id, createdAt: new Date() };
    this.performances.set(id, performance);
    return performance;
  }

  async updatePerformance(id: string, updateData: Partial<InsertPerformance>): Promise<Performance | undefined> {
    const performance = this.performances.get(id);
    if (!performance) return undefined;
    
    const updated = { ...performance, ...updateData };
    this.performances.set(id, updated);
    return updated;
  }

  async deletePerformance(id: string): Promise<boolean> {
    return this.performances.delete(id);
  }

  // Content
  async getContent(key: string): Promise<Content | undefined> {
    return this.content.get(key);
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }

  async createOrUpdateContent(insertContent: InsertContent): Promise<Content> {
    const existing = this.content.get(insertContent.key);
    const content: Content = {
      id: existing?.id || randomUUID(),
      ...insertContent,
      updatedAt: new Date(),
    };
    this.content.set(insertContent.key, content);
    return content;
  }

  // Gallery Photos
  async getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return Array.from(this.galleryPhotos.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getGalleryPhoto(id: string): Promise<GalleryPhoto | undefined> {
    return this.galleryPhotos.get(id);
  }

  async getFeaturedGalleryPhotos(): Promise<GalleryPhoto[]> {
    return Array.from(this.galleryPhotos.values()).filter(p => p.featured);
  }

  async createGalleryPhoto(insertPhoto: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const id = randomUUID();
    const photo: GalleryPhoto = { 
      ...insertPhoto, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.galleryPhotos.set(id, photo);
    return photo;
  }

  async updateGalleryPhoto(id: string, updateData: Partial<InsertGalleryPhoto>): Promise<GalleryPhoto | undefined> {
    const photo = this.galleryPhotos.get(id);
    if (!photo) return undefined;
    
    const updated = { 
      ...photo, 
      ...updateData,
      updatedAt: new Date()
    };
    this.galleryPhotos.set(id, updated);
    return updated;
  }

  async deleteGalleryPhoto(id: string): Promise<boolean> {
    return this.galleryPhotos.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Performers
  async getPerformers(): Promise<Performer[]> {
    return await db.select().from(performers);
  }

  async getPerformer(id: string): Promise<Performer | undefined> {
    const [performer] = await db.select().from(performers).where(eq(performers.id, id));
    return performer;
  }

  async getFeaturedPerformers(): Promise<Performer[]> {
    return await db.select().from(performers).where(eq(performers.featured, true));
  }

  async createPerformer(insertPerformer: InsertPerformer): Promise<Performer> {
    const [performer] = await db.insert(performers).values(insertPerformer).returning();
    return performer;
  }

  async updatePerformer(id: string, updateData: Partial<InsertPerformer>): Promise<Performer | undefined> {
    const [performer] = await db.update(performers)
      .set(updateData)
      .where(eq(performers.id, id))
      .returning();
    return performer;
  }

  async deletePerformer(id: string): Promise<boolean> {
    const result = await db.delete(performers).where(eq(performers.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Videos
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos);
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async getFeaturedVideos(): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.featured, true));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }

  async updateVideo(id: string, updateData: Partial<InsertVideo>): Promise<Video | undefined> {
    const [video] = await db.update(videos)
      .set(updateData)
      .where(eq(videos.id, id))
      .returning();
    return video;
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Performances
  async getPerformances(): Promise<Performance[]> {
    return await db.select().from(performances);
  }

  async getPerformance(id: string): Promise<Performance | undefined> {
    const [performance] = await db.select().from(performances).where(eq(performances.id, id));
    return performance;
  }

  async getUpcomingPerformances(): Promise<Performance[]> {
    const now = new Date();
    return await db.select().from(performances).where(gte(performances.date, now));
  }

  async createPerformance(insertPerformance: InsertPerformance): Promise<Performance> {
    const [performance] = await db.insert(performances).values(insertPerformance).returning();
    return performance;
  }

  async updatePerformance(id: string, updateData: Partial<InsertPerformance>): Promise<Performance | undefined> {
    const [performance] = await db.update(performances)
      .set(updateData)
      .where(eq(performances.id, id))
      .returning();
    return performance;
  }

  async deletePerformance(id: string): Promise<boolean> {
    const result = await db.delete(performances).where(eq(performances.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Content
  async getContent(key: string): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.key, key));
    return contentItem;
  }

  async getAllContent(): Promise<Content[]> {
    return await db.select().from(content);
  }

  async createOrUpdateContent(insertContent: InsertContent): Promise<Content> {
    const [contentItem] = await db
      .insert(content)
      .values(insertContent)
      .onConflictDoUpdate({
        target: content.key,
        set: {
          ...insertContent,
          updatedAt: new Date(),
        },
      })
      .returning();
    return contentItem;
  }

  // Gallery Photos
  async getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return await db.select().from(galleryPhotos).orderBy(galleryPhotos.createdAt);
  }

  async getGalleryPhoto(id: string): Promise<GalleryPhoto | undefined> {
    const [photo] = await db.select().from(galleryPhotos).where(eq(galleryPhotos.id, id));
    return photo;
  }

  async getFeaturedGalleryPhotos(): Promise<GalleryPhoto[]> {
    return await db.select().from(galleryPhotos).where(eq(galleryPhotos.featured, true));
  }

  async createGalleryPhoto(insertPhoto: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const [photo] = await db.insert(galleryPhotos).values(insertPhoto).returning();
    return photo;
  }

  async updateGalleryPhoto(id: string, updateData: Partial<InsertGalleryPhoto>): Promise<GalleryPhoto | undefined> {
    const [photo] = await db.update(galleryPhotos)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(galleryPhotos.id, id))
      .returning();
    return photo;
  }

  async deleteGalleryPhoto(id: string): Promise<boolean> {
    const result = await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
