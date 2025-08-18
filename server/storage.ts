import { type Performer, type InsertPerformer, type Video, type InsertVideo, type Performance, type InsertPerformance, type Content, type InsertContent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
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
}

export class MemStorage implements IStorage {
  private performers: Map<string, Performer>;
  private videos: Map<string, Video>;
  private performances: Map<string, Performance>;
  private content: Map<string, Content>;

  constructor() {
    this.performers = new Map();
    this.videos = new Map();
    this.performances = new Map();
    this.content = new Map();
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
      featured: true,
      createdAt: new Date(),
    };

    const performer2: Performer = {
      id: randomUUID(),
      name: "Sebastian Cross",
      role: "Artistic Director",
      bio: "Visionary choreographer and performer who founded the company to push the boundaries of traditional ballet. Sebastian's innovative approach combines classical technique with contemporary expression, creating performances that challenge and inspire.",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      featured: true,
      createdAt: new Date(),
    };

    const performer3: Performer = {
      id: randomUUID(),
      name: "Dante Valentino",
      role: "Premier Soloist",
      bio: "Known for his graceful technique and emotional depth, Dante captivates audiences with every movement. His performances are characterized by a unique blend of athleticism and artistry that brings stories to life on stage.",
      imageUrl: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
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
}

export const storage = new MemStorage();
