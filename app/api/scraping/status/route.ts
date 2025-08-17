import { NextResponse } from 'next/server';
import { scrapingService } from '@/lib/scrapingService';

export async function GET() {
  try {
    const status = await scrapingService.getScrapingStatus();
    
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Scraping status API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get scraping status' },
      { status: 500 }
    );
  }
}