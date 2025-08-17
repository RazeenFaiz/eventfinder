import { NextResponse } from 'next/server';
import { scrapingService } from '@/lib/scrapingService';

export async function POST() {
  try {
    // Run scraping in background
    scrapingService.runScraping().catch(error => {
      console.error('Background scraping error:', error);
    });
    
    return NextResponse.json({
      success: true,
      message: 'Scraping started in background'
    });
  } catch (error) {
    console.error('Manual scraping API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to start scraping' },
      { status: 500 }
    );
  }
}