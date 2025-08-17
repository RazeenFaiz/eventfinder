import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '@/lib/eventService';
import { EventCategory } from '@/types/event';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const searchQuery = searchParams.get('search') || '';
    const categoriesParam = searchParams.get('categories') || '';
    const categories = categoriesParam 
      ? categoriesParam.split(',').filter(c => c.trim()) as EventCategory[]
      : [];
    
    // Parse bounds for area-based search
    let bounds;
    const boundsParam = searchParams.get('bounds');
    if (boundsParam) {
      try {
        const [swLat, swLng, neLat, neLng] = boundsParam.split(',').map(Number);
        bounds = {
          southWest: [swLat, swLng] as [number, number],
          northEast: [neLat, neLng] as [number, number]
        };
      } catch (error) {
        console.error('Invalid bounds parameter:', boundsParam);
      }
    }
    
    const result = await eventService.searchEvents({
      searchQuery,
      categories,
      bounds
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, data: [], message: 'Internal server error' },
      { status: 500 }
    );
  }
}