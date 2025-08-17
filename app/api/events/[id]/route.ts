import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '@/lib/eventService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await eventService.getEventById(params.id);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }
    
    if (!result.data) {
      return NextResponse.json(
        { success: false, data: null, message: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, data: null, message: 'Internal server error' },
      { status: 500 }
    );
  }
}