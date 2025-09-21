#!/usr/bin/env node

/**
 * Script to start the development server with network access
 * and display connection information
 */

import { execSync } from 'child_process';
import os from 'os';

function getLocalIPAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        addresses.push({
          name: name,
          address: interface.address
        });
      }
    }
  }
  
  return addresses;
}

function displayNetworkInfo() {
  const addresses = getLocalIPAddresses();
  
  console.log('\n🌐 CHATTER VIEWER - NETWORK ACCESS ENABLED');
  console.log('=' .repeat(50));
  
  console.log('\n📱 Access your chat viewer from any device on your network:');
  console.log('\n🖥️  Local (this computer):');
  console.log('   http://localhost:5173');
  console.log('   http://127.0.0.1:5173');
  
  if (addresses.length > 0) {
    console.log('\n📱 Network (other devices):');
    addresses.forEach(addr => {
      console.log(`   http://${addr.address}:5173  (${addr.name})`);
    });
    
    console.log('\n📋 Quick Access URLs:');
    addresses.forEach(addr => {
      console.log(`   • ${addr.address}:5173`);
    });
  } else {
    console.log('\n⚠️  No network interfaces found. You may need to check your network connection.');
  }
  
  console.log('\n🔧 Instructions for other devices:');
  console.log('   1. Make sure devices are on the same WiFi network');
  console.log('   2. Open a web browser on the device');
  console.log('   3. Enter one of the network URLs above');
  console.log('   4. Enjoy browsing your WhatsApp chats!');
  
  console.log('\n🛡️  Security Note:');
  console.log('   • This server is accessible to anyone on your local network');
  console.log('   • Make sure you trust the network you\'re connected to');
  console.log('   • Press Ctrl+C to stop the server when done');
  
  console.log('\n🚀 Starting development server...\n');
}

// Display network information
displayNetworkInfo();

// Start the Vite development server with network access
try {
  execSync('npm run dev:network', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('\n❌ Failed to start server:', error.message);
  console.log('\n💡 Try running manually:');
  console.log('   npm run dev:network');
  process.exit(1);
}
