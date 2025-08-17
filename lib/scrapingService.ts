import cron from 'node-cron';
import connectDB from './database';
import Event from '@/models/Event';
import { UniversityScraper } from './scrapers/universityScraper';
import { TechEventScraper } from './scrapers/techEventScraper';
import { CulturalEventScraper } from './scrapers/culturalEventScraper';
import { ScrapedEvent } from './scrapers/baseScraper';

class ScrapingService {
  private scrapers = [
    new UniversityScraper(),
    new TechEventScraper(),
    new CulturalEventScraper()
  ];

  private isRunning = false;

  async initialize() {
    if (process.env.SCRAPING_ENABLED !== 'true') {
      console.log('🔄 Scraping is disabled');
      return;
    }

    console.log('🚀 Initializing scraping service...');
    
    // Run initial scrape
    await this.runScraping();

    // Schedule regular scraping every 6 hours
    const intervalHours = parseInt(process.env.SCRAPING_INTERVAL_HOURS || '6');
    const cronExpression = `0 */${intervalHours} * * *`;
    
    cron.schedule(cronExpression, async () => {
      console.log(`⏰ Scheduled scraping started (every ${intervalHours} hours)`);
      await this.runScraping();
    });

    console.log(`✅ Scraping service initialized with ${intervalHours}h interval`);
  }

  async runScraping() {
    if (this.isRunning) {
      console.log('⚠️ Scraping already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('🔍 Starting event scraping...');

    try {
      await connectDB();
      
      let totalNewEvents = 0;
      let totalUpdatedEvents = 0;

      for (const scraper of this.scrapers) {
        try {
          console.log(`🔄 Running ${scraper.constructor.name}...`);
          const scrapedEvents = await scraper.scrape();
          
          const { newEvents, updatedEvents } = await this.saveEvents(scrapedEvents);
          totalNewEvents += newEvents;
          totalUpdatedEvents += updatedEvents;
          
          console.log(`✅ ${scraper.constructor.name}: ${newEvents} new, ${updatedEvents} updated`);
        } catch (error) {
          console.error(`❌ Error in ${scraper.constructor.name}:`, error);
        }
      }

      console.log(`🎉 Scraping completed: ${totalNewEvents} new events, ${totalUpdatedEvents} updated`);
      
      // Clean up old events (older than 30 days past their end date)
      await this.cleanupOldEvents();
      
    } catch (error) {
      console.error('❌ Scraping service error:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private async saveEvents(scrapedEvents: ScrapedEvent[]): Promise<{ newEvents: number; updatedEvents: number }> {
    let newEvents = 0;
    let updatedEvents = 0;

    for (const eventData of scrapedEvents) {
      try {
        const existingEvent = await Event.findOne({ sourceUrl: eventData.sourceUrl });
        
        if (existingEvent) {
          // Update existing event
          await Event.updateOne(
            { sourceUrl: eventData.sourceUrl },
            { 
              ...eventData,
              lastScraped: new Date()
            }
          );
          updatedEvents++;
        } else {
          // Create new event
          await Event.create({
            ...eventData,
            lastScraped: new Date()
          });
          newEvents++;
        }
      } catch (error) {
        console.error('Error saving event:', eventData.title, error);
      }
    }

    return { newEvents, updatedEvents };
  }

  private async cleanupOldEvents() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Event.deleteMany({
        endDate: { $lt: thirtyDaysAgo.toISOString() }
      });

      if (result.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${result.deletedCount} old events`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up old events:', error);
    }
  }

  async getScrapingStatus() {
    try {
      await connectDB();
      
      const totalEvents = await Event.countDocuments();
      const recentEvents = await Event.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      const lastScrapedEvent = await Event.findOne().sort({ lastScraped: -1 });
      
      return {
        totalEvents,
        recentEvents,
        lastScrapeTime: lastScrapedEvent?.lastScraped || null,
        isRunning: this.isRunning
      };
    } catch (error) {
      console.error('Error getting scraping status:', error);
      return null;
    }
  }
}

export const scrapingService = new ScrapingService();