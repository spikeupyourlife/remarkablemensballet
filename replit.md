# Overview

This is a full-stack web application for a ballet company called "Remarkable Mens Ballet". The application serves as a professional website featuring performer profiles, video galleries, upcoming performances, and a content management system. Built with React, TypeScript, Express.js, and PostgreSQL, it provides both a public-facing website and administrative capabilities for managing content.

## Recent Changes (August 2025)
- Implemented comprehensive gallery management system with search, sort, and filter capabilities
- Fixed gallery photo upload issues with proper image URL normalization
- Added performer linking to gallery photos with cross-referencing functionality  
- Enhanced CMS with full gallery CRUD operations and media management
- Added automatic YouTube thumbnail extraction for video content
- Implemented public gallery filtering with search, sort, and performer filters
- Created lightbox modal for full-size image viewing with detailed photo information
- Enhanced video player with real YouTube thumbnails instead of placeholders
- Added comprehensive performer management with date ranges and visibility controls
- Enhanced CMS content management with Privacy Policy, Terms of Service, and About page editing
- Implemented dynamic social media links and contact information management through CMS
- Updated logo from crown to butterfly icon throughout application and favicon
- Fixed content editor button formatting and improved JSON validation for structured content
- Created proper routing for all legal and informational pages with dynamic content loading

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Component Library**: Radix UI components with shadcn/ui for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with CRUD operations for performers, videos, performances, and content
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot reload with Vite integration in development mode

## Database Design
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon Database as the serverless provider
- **Schema**: Four main entities:
  - Performers (id, name, role, bio, imageUrl, featured, createdAt)
  - Videos (id, title, description, videoUrl, thumbnailUrl, featured, createdAt)
  - Performances (id, title, description, venue, date, time, ticketUrl, createdAt)
  - Content (id, key, title, content, updatedAt) for CMS functionality

## Project Structure
- **Shared Types**: Common schema definitions in `/shared` directory accessible to both client and server
- **Client**: React application in `/client` directory with component-based architecture
- **Server**: Express API in `/server` directory with modular route handlers
- **Build Output**: Client builds to `/dist/public`, server builds to `/dist`

## Content Management
- **CMS Interface**: Complete admin panel for managing performers, videos, performances, and content
- **File Storage**: Google Cloud Storage integration with Uppy for secure file uploads (5MB limit)
- **Image Handling**: Professional image upload system with automatic ACL policy management
- **Content Types**: Dynamic content management with full CRUD operations
- **Performer Management**: Complete performer profiles with image galleries and bio modals
- **Duplicate Prevention**: Automatic duplicate performer detection and merge functionality

## Authentication & Security
- **Current State**: Full Replit Auth integration with SESSION_SECRET and user management
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Object Storage**: Google Cloud Storage integration for secure file uploads with ACL policies
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Performance Features
- **Code Splitting**: Vite-based bundling with optimized builds
- **Image Optimization**: Lazy loading and responsive image handling
- **Caching**: React Query provides intelligent caching for API responses
- **Development Tools**: Runtime error overlay and hot module replacement

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire application
- **Vite**: Build tool and development server

## Database & ORM
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Drizzle-kit**: Database migration and schema management tools

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component library for accessibility
- **shadcn/ui**: Pre-built component system on top of Radix
- **Lucide React**: Icon library for consistent iconography

## State Management & Forms
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Performance-focused form library
- **Zod**: Schema validation for TypeScript
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## File Upload & Storage
- **Google Cloud Storage**: Cloud storage service for file uploads
- **Uppy**: File uploader with multiple plugins (AWS S3, Dashboard, Drag & Drop)
- **@uppy/react**: React integration for Uppy components

## Development & Build Tools
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Autoprefixer
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **wouter**: Minimalist routing library for React

## Fonts & Assets
- **Google Fonts**: Playfair Display, Inter, and Dancing Script for typography
- **Unsplash**: Placeholder images for content without custom uploads