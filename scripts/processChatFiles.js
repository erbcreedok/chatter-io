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
  
  try {
    const items = fs.readdirSync(DATA_DIR);
    
    for (const item of items) {
      const itemPath = path.join(DATA_DIR, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isFile() && item.endsWith('.txt')) {
        // Process individual .txt files
        const content = fs.readFileSync(itemPath, 'utf8');
        const chatName = item.replace('.txt', '').replace(/^_/, '');
        
        chats.push({
          name: chatName,
          content: content,
          mediaFiles: [],
          source: item
        });
        
        console.log(`✓ Processed file: ${item}`);
      } else if (stat.isDirectory() && item.startsWith('WhatsApp Chat -')) {
        // Process WhatsApp chat directories
        const chatTxtPath = path.join(itemPath, '_chat.txt');
        
        if (fs.existsSync(chatTxtPath)) {
          const content = fs.readFileSync(chatTxtPath, 'utf8');
          const chatName = item.replace('WhatsApp Chat - ', '').replace(/\s\(\d+\)$/, '');
          
          // Find media files in the directory
          const mediaFiles = fs.readdirSync(itemPath)
            .filter(file => file !== '_chat.txt')
            .filter(file => {
              const ext = path.extname(file).toLowerCase();
              return ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.opus', '.vcf'].includes(ext);
            });
          
          chats.push({
            name: chatName,
            content: content,
            mediaFiles: mediaFiles,
            source: item
          });
          
          console.log(`✓ Processed chat: ${chatName} (${mediaFiles.length} media files)`);
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

// Run the script
console.log('🚀 Processing WhatsApp chat files...\n');
readChatFiles();
