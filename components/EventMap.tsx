'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Event, EventCategory } from '@/types/event';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';

// Import Leaflet marker shadow image
const iconShadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';

// Category-specific marker colors
const categoryIcons: Record<EventCategory, Icon> = {
  Tech: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#3B82F6"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <path d="M9 10h7v1H9zm0 2h7v1H9zm0 2h5v1H9z" fill="#3B82F6"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  Conference: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#8B5CF6"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <path d="M8 9h9v1H8zm0 2h9v1H8zm0 2h9v1H8zm0 2h6v1H8z" fill="#8B5CF6"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  Workshop: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#10B981"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <path d="M12.5 7l2 2-2 2-2-2zm-3 4h6v1H9.5zm0 2h6v1H9.5z" fill="#10B981"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  Festival: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#F97316"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <path d="M12.5 6l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3L8 11h3z" fill="#F97316"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  Academic: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#6366F1"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <path d="M12.5 7l-4 2v4l4 2 4-2V9z" fill="#6366F1"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  Religious: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#EAB308"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <circle cx="12.5" cy="10" r="2" fill="#EAB308"/>
        <path d="M12.5 12v5" stroke="#EAB308" stroke-width="2"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  Business: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#6B7280"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <rect x="9" y="8" width="7" height="9" fill="#6B7280"/>
        <rect x="10" y="9" width="1" height="1" fill="white"/>
        <rect x="12" y="9" width="1" height="1" fill="white"/>
        <rect x="14" y="9" width="1" height="1" fill="white"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  Sports: new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#EF4444"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <circle cx="12.5" cy="12.5" r="3" fill="none" stroke="#EF4444" stroke-width="2"/>
        <path d="M12.5 7v11M7 12.5h11" stroke="#EF4444" stroke-width="1"/>
      </svg>
    `)}`,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
};

interface EventMapProps {
  events: Event[];
  onBoundsChange?: (bounds: { northEast: [number, number]; southWest: [number, number] }) => void;
  selectedEvent?: Event | null;
}

function MapEventHandler({ onBoundsChange, events }: { onBoundsChange?: EventMapProps['onBoundsChange'], events: Event[] }) {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          northEast: [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
          southWest: [bounds.getSouthWest().lat, bounds.getSouthWest().lng]
        });
      }
    }
  });

  // Fit bounds to show all events when events change
  useEffect(() => {
    if (events.length > 0) {
      const bounds = new LatLngBounds(
        events.map(event => event.location.coordinates)
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [events, map]);

  return null;
}

export function EventMap({ events, onBoundsChange, selectedEvent }: EventMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[7.8731, 80.7718]} // Center of Sri Lanka
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler onBoundsChange={onBoundsChange} events={events} />
        
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.location.coordinates}
            icon={categoryIcons[event.category]}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[250px]">
                <h3 className="font-semibold text-sm mb-2 leading-tight">
                  {event.title}
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {event.location.name}</p>
                  <p><strong>Category:</strong> {event.category}</p>
                  <p><strong>Price:</strong> {event.ticketPrice ? `LKR ${event.ticketPrice.toLocaleString()}` : 'Free'}</p>
                  <p><strong>Organizer:</strong> {event.organizer}</p>
                </div>
                <p className="text-xs mt-2 line-clamp-3">
                  {event.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}