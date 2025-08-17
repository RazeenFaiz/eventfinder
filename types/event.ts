export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    coordinates: [number, number]; // [lat, lng]
    address: string;
  };
  category: EventCategory;
  ticketPrice: number | null; // null for free events
  sourceUrl: string;
  organizer: string;
  imageUrl?: string;
}

export type EventCategory = 
  | 'Tech' 
  | 'Conference' 
  | 'Workshop' 
  | 'Festival' 
  | 'Academic' 
  | 'Religious' 
  | 'Business' 
  | 'Sports';

export interface EventFilters {
  categories: EventCategory[];
  searchQuery: string;
  bounds?: {
    northEast: [number, number];
    southWest: [number, number];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}