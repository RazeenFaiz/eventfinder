import { Event, EventFilters, ApiResponse } from '@/types/event';
import connectDB from './database';
import EventModel from '@/models/Event';

class EventService {
  async searchEvents(filters: EventFilters): Promise<ApiResponse<Event[]>> {
    try {
      await connectDB();
      
      let query: any = {};
      
      // Build MongoDB query
      const conditions: any[] = [];
      
      // Filter by categories
      if (filters.categories.length > 0) {
        conditions.push({ category: { $in: filters.categories } });
      }
      
      // Filter by search query
      if (filters.searchQuery.trim()) {
        conditions.push({
          $text: { $search: filters.searchQuery.trim() }
        });
      }
      
      // Filter by bounds (area-based search)
      if (filters.bounds) {
        const { northEast, southWest } = filters.bounds;
        conditions.push({
          'location.coordinates': {
            $geoWithin: {
              $box: [southWest, northEast]
            }
          }
        });
      }
      
      if (conditions.length > 0) {
        query = { $and: conditions };
      }
      
      // Execute query with sorting by start date
      const events = await EventModel.find(query)
        .sort({ startDate: 1 })
        .limit(500) // Limit results for performance
        .lean();
      
      // Transform MongoDB documents to match Event interface
      const transformedEvents: Event[] = events.map(event => ({
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        category: event.category,
        ticketPrice: event.ticketPrice,
        sourceUrl: event.sourceUrl,
        organizer: event.organizer,
        imageUrl: event.imageUrl
      }));
      
      return {
        success: true,
        data: transformedEvents,
        total: transformedEvents.length
      };
    } catch (error) {
      console.error('Error searching events:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch events'
      };
    }
  }
  
  async getEventById(id: string): Promise<ApiResponse<Event | null>> {
    try {
      await connectDB();
      
      const eventDoc = await EventModel.findById(id).lean();
      const event = eventDoc ? {
        id: eventDoc._id.toString(),
        ...eventDoc
      } as Event : null;
      
      return {
        success: true,
        data: event || null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch event'
      };
    }
  }
}

export const eventService = new EventService();