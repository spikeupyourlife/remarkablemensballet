#!/usr/bin/env node

/**
 * Data Export Script for Remarkable Men's Ballet
 * 
 * This script exports development database content in a format that can be
 * manually recreated in production via the CMS interface.
 * 
 * Usage: node scripts/export-data.js
 */

import { promises as fs } from 'fs';
import { db } from '../server/db.ts';
import { performers, videos, galleryPhotos } from '../shared/schema.ts';

async function exportData() {
  try {
    console.log('🎭 Exporting Remarkable Men\'s Ballet data...\n');

    // Export performers
    const performerData = await db.select().from(performers);
    console.log('👨‍🎭 PERFORMERS TO RECREATE IN PRODUCTION:');
    console.log('=' .repeat(50));
    
    performerData.forEach((performer, index) => {
      console.log(`${index + 1}. Name: ${performer.name}`);
      console.log(`   Role: ${performer.role}`);
      console.log(`   Featured: ${performer.featured ? 'Yes' : 'No'}`);
      console.log(`   Image URL: ${performer.imageUrl || 'None'}`);
      console.log(`   Bio: ${performer.bio.substring(0, 100)}...`);
      console.log('');
    });

    // Export videos  
    const videoData = await db.select().from(videos);
    console.log('\n🎬 VIDEOS TO RECREATE IN PRODUCTION:');
    console.log('=' .repeat(50));
    
    videoData.forEach((video, index) => {
      console.log(`${index + 1}. Title: ${video.title}`);
      console.log(`   Description: ${video.description || 'None'}`);
      console.log(`   YouTube URL: ${video.videoUrl}`);
      console.log(`   Featured: ${video.featured ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Export gallery photos
    const galleryData = await db.select().from(galleryPhotos);
    console.log('\n📸 GALLERY PHOTOS TO RECREATE IN PRODUCTION:');
    console.log('=' .repeat(50));
    
    galleryData.forEach((photo, index) => {
      console.log(`${index + 1}. Title: ${photo.title}`);
      console.log(`   Description: ${photo.description || 'None'}`);
      console.log(`   Show Name: ${photo.showName || 'None'}`);
      console.log(`   Show Date: ${photo.showDate || 'None'}`);
      console.log(`   Image URL: ${photo.imageUrl}`);
      console.log(`   Featured: ${photo.featured ? 'Yes' : 'No'}`);
      console.log(`   Linked Performers: ${photo.performerIds?.length || 0} performers`);
      console.log('');
    });

    // Create JSON backup
    const exportData = {
      exportDate: new Date().toISOString(),
      performers: performerData,
      videos: videoData,
      galleryPhotos: galleryData
    };

    await fs.writeFile(
      'data-export.json', 
      JSON.stringify(exportData, null, 2)
    );

    console.log('\n✅ INSTRUCTIONS FOR PRODUCTION SYNC:');
    console.log('=' .repeat(50));
    console.log('1. Access your production site\'s CMS (/cms)');
    console.log('2. Use the CMS interface to manually recreate each:');
    console.log('   - Performer (copy name, role, bio, set featured status)');
    console.log('   - Video (copy title, description, YouTube URL, set featured)');
    console.log('   - Gallery Photo (upload image, copy details, link performers)');
    console.log('3. For images, you\'ll need to re-upload them through the CMS');
    console.log('4. A JSON backup has been saved to: data-export.json');
    console.log('\n🚀 After manual recreation, redeploy to see changes!');

  } catch (error) {
    console.error('❌ Export failed:', error);
  }
}

exportData();