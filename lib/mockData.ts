import { Event, EventCategory } from '@/types/event';

export const sriLankanCities = [
  { name: 'Colombo', coordinates: [6.9271, 79.8612] as [number, number] },
  { name: 'Kandy', coordinates: [7.2906, 80.6337] as [number, number] },
  { name: 'Galle', coordinates: [6.0535, 80.2210] as [number, number] },
  { name: 'Jaffna', coordinates: [9.6615, 80.0255] as [number, number] },
  { name: 'Negombo', coordinates: [7.2084, 79.8380] as [number, number] },
  { name: 'Anuradhapura', coordinates: [8.3114, 80.4037] as [number, number] },
  { name: 'Matara', coordinates: [5.9549, 80.5550] as [number, number] },
  { name: 'Batticaloa', coordinates: [7.7102, 81.6924] as [number, number] },
  { name: 'Trincomalee', coordinates: [8.5874, 81.2152] as [number, number] },
  { name: 'Ratnapura', coordinates: [6.6828, 80.4000] as [number, number] }
];

const eventTitles = [
  'Sri Lanka Tech Summit 2024',
  'Digital Innovation Workshop',
  'Startup Pitch Competition',
  'Buddhist Philosophy Conference',
  'Ayurveda Wellness Retreat',
  'Sustainable Agriculture Forum',
  'Traditional Arts Festival',
  'Business Leadership Seminar',
  'Environmental Conservation Workshop',
  'Cultural Heritage Exhibition',
  'Youth Entrepreneurship Meet',
  'Academic Research Symposium',
  'Healthcare Innovation Summit',
  'Tourism Development Conference',
  'Social Media Marketing Workshop',
  'Traditional Dance Festival',
  'Educational Technology Forum',
  'Community Development Meeting',
  'Art and Craft Exhibition',
  'Professional Networking Event'
];

const categories: EventCategory[] = ['Tech', 'Conference', 'Workshop', 'Festival', 'Academic', 'Religious', 'Business', 'Sports'];

const organizers = [
  'University of Colombo',
  'Kandy Tech Hub',
  'Sri Lanka Chamber of Commerce',
  'Buddhist Cultural Centre',
  'Galle Literary Festival',
  'TechStars Colombo',
  'Ministry of Education',
  'Ceylon Chamber of Commerce',
  'Colombo Design Week',
  'Innovation Lab LK'
];

export function generateMockEvents(count: number = 50): Event[] {
  const events: Event[] = [];
  
  for (let i = 0; i < count; i++) {
    const city = sriLankanCities[Math.floor(Math.random() * sriLankanCities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = eventTitles[Math.floor(Math.random() * eventTitles.length)];
    const organizer = organizers[Math.floor(Math.random() * organizers.length)];
    
    // Add some random offset to coordinates for variety
    const lat = city.coordinates[0] + (Math.random() - 0.5) * 0.1;
    const lng = city.coordinates[1] + (Math.random() - 0.5) * 0.1;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90));
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 24) + 1);
    
    events.push({
      id: `event-${i + 1}`,
      title: `${title} - ${city.name}`,
      description: `Join us for an exciting ${category.toLowerCase()} event in ${city.name}. This event will cover the latest trends and innovations in the field, featuring expert speakers and interactive sessions.`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: {
        name: city.name,
        coordinates: [lat, lng],
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${city.name}, Sri Lanka`
      },
      category,
      ticketPrice: Math.random() > 0.4 ? Math.floor(Math.random() * 5000) + 500 : null,
      sourceUrl: `https://example.com/events/event-${i + 1}`,
      organizer,
      imageUrl: `https://images.pexels.com/photos/${1500000 + Math.floor(Math.random() * 1000000)}/pexels-photo-${1500000 + Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop`
    });
  }
  
  return events;
}