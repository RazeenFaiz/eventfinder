import { Event, EventCategory } from '@/types/event';

export interface ScrapedEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    coordinates: [number, number];
    address: string;
  };
  category: EventCategory;
  ticketPrice: number | null;
  sourceUrl: string;
  organizer: string;
  imageUrl?: string;
}

export abstract class BaseScraper {
  protected name: string;
  protected baseUrl: string;

  constructor(name: string, baseUrl: string) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  abstract scrape(): Promise<ScrapedEvent[]>;

  protected categorizeEvent(title: string, description: string): EventCategory {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('tech') || text.includes('software') || text.includes('programming') || text.includes('ai') || text.includes('digital')) {
      return 'Tech';
    }
    if (text.includes('conference') || text.includes('summit') || text.includes('symposium')) {
      return 'Conference';
    }
    if (text.includes('workshop') || text.includes('training') || text.includes('seminar')) {
      return 'Workshop';
    }
    if (text.includes('festival') || text.includes('celebration') || text.includes('cultural')) {
      return 'Festival';
    }
    if (text.includes('academic') || text.includes('research') || text.includes('university') || text.includes('education')) {
      return 'Academic';
    }
    if (text.includes('religious') || text.includes('buddhist') || text.includes('temple') || text.includes('spiritual')) {
      return 'Religious';
    }
    if (text.includes('business') || text.includes('entrepreneur') || text.includes('startup') || text.includes('networking')) {
      return 'Business';
    }
    if (text.includes('sport') || text.includes('game') || text.includes('tournament') || text.includes('match')) {
      return 'Sports';
    }
    
    return 'Conference'; // Default category
  }

  protected extractPrice(text: string): number | null {
    const priceMatch = text.match(/(?:rs\.?|lkr\.?|rupees?)\s*(\d+(?:,\d{3})*)/i);
    if (priceMatch) {
      return parseInt(priceMatch[1].replace(/,/g, ''));
    }
    
    if (text.toLowerCase().includes('free') || text.toLowerCase().includes('no charge')) {
      return null;
    }
    
    return null;
  }

  protected getRandomCoordinatesForCity(cityName: string): [number, number] {
    const cities: Record<string, [number, number]> = {
      'colombo': [6.9271, 79.8612],
      'kandy': [7.2906, 80.6337],
      'galle': [6.0535, 80.2210],
      'jaffna': [9.6615, 80.0255],
      'negombo': [7.2084, 79.8380],
      'anuradhapura': [8.3114, 80.4037],
      'matara': [5.9549, 80.5550],
      'batticaloa': [7.7102, 81.6924],
      'trincomalee': [8.5874, 81.2152],
      'ratnapura': [6.6828, 80.4000]
    };

    const city = cityName.toLowerCase();
    const baseCoords = cities[city] || cities['colombo'];
    
    // Add small random offset for variety
    return [
      baseCoords[0] + (Math.random() - 0.5) * 0.05,
      baseCoords[1] + (Math.random() - 0.5) * 0.05
    ];
  }
}

export { BaseScraper }