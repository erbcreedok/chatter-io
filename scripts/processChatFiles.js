#!/usr/bin/env node

/**
 * Script to process WhatsApp chat files and generate a JSON file
 * that can be imported into the React application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'raw');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'processedChats.json');

function readChatFiles() {
  const chats = [];
  const nameCount = new Map(); // Track duplicate names
  
  try {
    const items = fs.readdirSync(DATA_DIR);
    
    for (const item of items) {
      const itemPath = path.join(DATA_DIR, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isFile() && item.endsWith('.txt')) {
        // Process individual .txt files
        const content = fs.readFileSync(itemPath, 'utf8');
        let chatName = item.replace('.txt', '').replace(/^_/, '');
        
        // Handle duplicate names
        chatName = getUniqueName(chatName, nameCount);
        
        chats.push({
          name: chatName,
          content: content,
          mediaFiles: [],
          source: item
        });
        
        console.log(`✓ Processed file: ${item} -> ${chatName}`);
      } else if (stat.isDirectory() && item.startsWith('WhatsApp Chat -')) {
        // Process WhatsApp chat directories
        const chatTxtPath = path.join(itemPath, '_chat.txt');
        
        if (fs.existsSync(chatTxtPath)) {
          const content = fs.readFileSync(chatTxtPath, 'utf8');
          let chatName = item.replace('WhatsApp Chat - ', '').replace(/\s\(\d+\)$/, '');
          
          // Handle duplicate names
          chatName = getUniqueName(chatName, nameCount);
          
          // Find and categorize media files in the directory
          const allFiles = fs.readdirSync(itemPath).filter(file => file !== '_chat.txt');
          const mediaFiles = categorizeMediaFiles(allFiles, itemPath);
          
          chats.push({
            name: chatName,
            content: content,
            mediaFiles: mediaFiles,
            source: item
          });
          
          const totalMedia = Object.values(mediaFiles).reduce((sum, arr) => sum + arr.length, 0);
          console.log(`✓ Processed chat: ${chatName} (${totalMedia} media files)`);
        }
      }
    }
    
    // Write processed data to JSON file
    const outputData = {
      processedAt: new Date().toISOString(),
      totalChats: chats.length,
      chats: chats
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    
    console.log(`\n🎉 Successfully processed ${chats.length} chats!`);
    console.log(`📄 Output saved to: ${OUTPUT_FILE}`);
    console.log(`\nTo use in your React app, import from: src/data/processedChats.json`);
    
  } catch (error) {
    console.error('❌ Error processing chat files:', error.message);
    process.exit(1);
  }
}

// Helper function to generate unique names
function getUniqueName(baseName, nameCount) {
  if (!nameCount.has(baseName)) {
    nameCount.set(baseName, 1);
    return baseName;
  }
  
  const count = nameCount.get(baseName);
  nameCount.set(baseName, count + 1);
  return `${baseName} (${count})`;
}

// Helper function to categorize media files
function categorizeMediaFiles(files, dirPath) {
  const mediaFiles = {
    images: [],
    videos: [],
    audio: [],
    documents: []
  };
  
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    // Create public URL for the file
    const publicUrl = `/media/${dirPath.split('/').pop()}/${file}`;
    
    const fileInfo = {
      name: file,
      path: filePath,
      publicUrl: publicUrl,
      size: stats.size,
      type: ext.substring(1) // Remove the dot
    };
    
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      mediaFiles.images.push(fileInfo);
    } else if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
      mediaFiles.videos.push(fileInfo);
    } else if (['.opus', '.mp3', '.wav', '.m4a', '.ogg'].includes(ext)) {
      mediaFiles.audio.push(fileInfo);
    } else if (['.vcf', '.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
      mediaFiles.documents.push(fileInfo);
    }
  });
  
  return mediaFiles;
}

// Run the script
console.log('🚀 Processing WhatsApp chat files...\n');
readChatFiles();
