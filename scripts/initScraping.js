// This script initializes the scraping service
// Run with: node scripts/initScraping.js

const { scrapingService } = require('../lib/scrapingService');

async function initializeScraping() {
  console.log('🚀 Starting scraping service initialization...');
  
  try {
    await scrapingService.initialize();
    console.log('✅ Scraping service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize scraping service:', error);
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  initializeScraping();
}

module.exports = { initializeScraping };