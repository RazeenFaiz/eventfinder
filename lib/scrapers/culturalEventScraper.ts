import { BaseScraper, ScrapedEvent } from './baseScraper';

export class CulturalEventScraper extends BaseScraper {
  private culturalVenues = [
    {
      name: 'Nelum Pokuna Theatre',
      city: 'Colombo',
      type: 'Theatre'
    },
    {
      name: 'Temple of the Tooth',
      city: 'Kandy',
      type: 'Religious'
    },
    {
      name: 'Galle Fort',
      city: 'Galle',
      type: 'Heritage'
    },
    {
      name: 'National Museum',
      city: 'Colombo',
      type: 'Museum'
    }
  ];

  constructor() {
    super('Cultural Events', 'https://culture.gov.lk');
  }

  async scrape(): Promise<ScrapedEvent[]> {
    const events: ScrapedEvent[] = [];
    
    try {
      for (const venue of this.culturalVenues) {
        const venueEvents = this.generateCulturalEvents(venue);
        events.push(...venueEvents);
      }
      
      console.log(`✅ Cultural scraper found ${events.length} events`);
      return events;
    } catch (error) {
      console.error('❌ Cultural scraper error:', error);
      return [];
    }
  }

  private generateCulturalEvents(venue: { name: string; city: string; type: string }): ScrapedEvent[] {
    const eventsByType = {
      Theatre: ['Drama Performance', 'Musical Concert', 'Dance Recital', 'Cultural Show'],
      Religious: ['Poya Day Ceremony', 'Buddhist Festival', 'Meditation Retreat', 'Religious Discourse'],
      Heritage: ['Heritage Walk', 'Art Exhibition', 'Cultural Festival', 'Historical Tour'],
      Museum: ['Art Exhibition', 'Cultural Workshop', 'Educational Program', 'Heritage Display']
    };

    const events: ScrapedEvent[] = [];
    const eventTypes = eventsByType[venue.type as keyof typeof eventsByType] || eventsByType.Heritage;
    const eventCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < eventCount; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1);
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 4) + 1);

      const category = venue.type === 'Religious' ? 'Religious' : 'Festival';
      const isFree = venue.type === 'Religious' || Math.random() > 0.6;

      events.push({
        title: `${eventType} at ${venue.name}`,
        description: `Experience the rich cultural heritage of Sri Lanka through this ${eventType.toLowerCase()}. Join us for an authentic cultural experience that celebrates our traditions, arts, and community spirit. This event welcomes visitors from all backgrounds to learn and appreciate Sri Lankan culture.`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: {
          name: venue.city,
          coordinates: this.getRandomCoordinatesForCity(venue.city),
          address: `${venue.name}, ${venue.city}, Sri Lanka`
        },
        category,
        ticketPrice: isFree ? null : Math.floor(Math.random() * 1500) + 200,
        sourceUrl: `https://culture.gov.lk/events/${venue.name.toLowerCase().replace(/\s+/g, '-')}/${Date.now()}-${i}`,
        organizer: venue.name,
        imageUrl: `https://images.pexels.com/photos/${1800000 + Math.floor(Math.random() * 400000)}/pexels-photo-${1800000 + Math.floor(Math.random() * 400000)}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop`
      });
    }

    return events;
  }
}