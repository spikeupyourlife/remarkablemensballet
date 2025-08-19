import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json, index, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const performers = pgTable("performers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url"),
  galleryImages: text("gallery_images").array().default(sql`'{}'::text[]`),
  featured: boolean("featured").default(false),
  performingSince: timestamp("performing_since"),
  performingUntil: timestamp("performing_until"),
  isCurrentPerformer: boolean("is_current_performer").default(true),
  showInCurrentList: boolean("show_in_current_list").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  featured: boolean("featured").default(false),
  rating: real("rating").default(0), // Average rating 0-5
  ratingCount: integer("rating_count").default(0), // Number of ratings received
  createdAt: timestamp("created_at").defaultNow(),
});

export const performances = pgTable("performances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  venue: text("venue").notNull(),
  date: timestamp("date").notNull(), // Keep original date field for backwards compatibility
  time: text("time").notNull(), // Keep original time field for backwards compatibility
  posterUrl: text("poster_url"), // New poster image field
  showTimes: json("show_times").$type<{
    date: string; // ISO date string
    time: string;
    additionalInfo?: string; // e.g., "Matinee", "Opening Night"
  }[]>().default(sql`'[]'::json`), // Array of show times
  ticketUrl: text("ticket_url"),
  featured: boolean("featured").default(false), // New featured field
  createdAt: timestamp("created_at").defaultNow(),
});

export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  title: text("title"),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  imageUrl: varchar("image_url").notNull(),
  showDate: timestamp("show_date"),
  showName: varchar("show_name"),
  description: text("description"),
  tags: text("tags").array(),
  performerIds: text("performer_ids").array(), // IDs of performers in the photo
  whoTags: text("who_tags").array(), // Who was in the photo (non-performer names)
  whatTags: text("what_tags").array(), // What was happening
  whenTags: text("when_tags").array(), // When context (e.g., "opening night", "rehearsal")
  whereTags: text("where_tags").array(), // Where it was taken
  whyTags: text("why_tags").array(), // Why context (e.g., "celebration", "behind-scenes")
  featured: boolean("featured").default(false),
  views: integer("views").default(0), // Views count for gallery photos
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performer ratings table for individual ratings
export const performerRatings = pgTable("performer_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  performerId: varchar("performer_id").notNull(),
  userId: varchar("user_id"), // Can be null for anonymous ratings
  sessionId: varchar("session_id"), // For anonymous users
  rating: integer("rating").notNull(), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPerformerSchema = createInsertSchema(performers).omit({
  id: true,
  createdAt: true,
}).extend({
  // Ensure name and role have proper validation
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  role: z.string().min(1, "Role is required").max(200, "Role must be less than 200 characters"),
  bio: z.string().max(2000, "Bio must be less than 2000 characters"),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertPerformanceSchema = createInsertSchema(performances).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  venue: z.string().min(1, "Venue is required").max(200, "Venue must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  showTimes: z.array(z.object({
    date: z.string(),
    time: z.string(),
    additionalInfo: z.string().optional(),
  })).min(1, "At least one show time is required").optional(),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  updatedAt: true,
});

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerformerRatingSchema = createInsertSchema(performerRatings).omit({
  id: true,
  createdAt: true,
});

export type InsertPerformer = z.infer<typeof insertPerformerSchema>;
export type Performer = typeof performers.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertPerformance = z.infer<typeof insertPerformanceSchema>;
export type Performance = typeof performances.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;

export type InsertPerformerRating = z.infer<typeof insertPerformerRatingSchema>;
export type PerformerRating = typeof performerRatings.$inferSelect;

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
