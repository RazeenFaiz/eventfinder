'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Event, EventFilters } from '@/types/event';
import { eventService } from '@/lib/eventService';
import { SearchFilters } from '@/components/SearchFilters';
import { EventCard } from '@/components/EventCard';
import { EventDetails } from '@/components/EventDetails';
import { ScrapingStatus } from '@/components/ScrapingStatus';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, List, Loader2 } from 'lucide-react';

// Dynamically import EventMap to avoid SSR issues with Leaflet
const EventMap = dynamic(() => import('@/components/EventMap').then(mod => ({ default: mod.EventMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  )
});

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');

  // Load initial events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const result = await eventService.searchEvents({
        categories: [],
        searchQuery: ''
      });
      
      if (result.success) {
        setEvents(result.data);
        setFilteredEvents(result.data);
      }
      setLoading(false);
    };

    loadEvents();
  }, []);

  const handleFiltersChange = useCallback(async (filters: EventFilters) => {
    setLoading(true);
    const result = await eventService.searchEvents(filters);
    
    if (result.success) {
      setFilteredEvents(result.data);
    }
    setLoading(false);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleMapBoundsChange = useCallback((bounds: { northEast: [number, number]; southWest: [number, number] }) => {
    // In a real app, this would trigger a new API call for events in the visible area
    console.log('Map bounds changed:', bounds);
  }, []);

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-600" />
          <p className="text-muted-foreground">Loading Sri Lanka events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent">
              Sri Lanka Events Map
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover conferences, workshops, festivals, and more happening across beautiful Sri Lanka
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <SearchFilters 
          onFiltersChange={handleFiltersChange}
          eventCount={filteredEvents.length}
        />

        {/* Scraping Status */}
        <ScrapingStatus />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-0">
            <Card className="p-0 overflow-hidden">
              <div className="h-[600px] lg:h-[700px]">
                <EventMap 
                  events={filteredEvents}
                  onBoundsChange={handleMapBoundsChange}
                  selectedEvent={selectedEvent}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600 mb-2" />
                <p className="text-muted-foreground">Updating events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">No events found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria or browse all categories
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Event Details Modal */}
      <EventDetails
        event={selectedEvent}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Discover amazing events across Sri Lanka • Built with Next.js and Leaflet
            </p>
            <p className="text-xs text-muted-foreground">
              Event data is automatically collected and updated from various sources
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}