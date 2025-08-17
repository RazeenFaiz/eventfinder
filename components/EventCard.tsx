'use client';

import { Event } from '@/types/event';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
}

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-800 border-blue-200',
  Conference: 'bg-purple-100 text-purple-800 border-purple-200',
  Workshop: 'bg-green-100 text-green-800 border-green-200',
  Festival: 'bg-orange-100 text-orange-800 border-orange-200',
  Academic: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Religious: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Business: 'bg-gray-100 text-gray-800 border-gray-200',
  Sports: 'bg-red-100 text-red-800 border-red-200'
};

export function EventCard({ event, onClick }: EventCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/40"
      onClick={handleClick}
    >
      {event.imageUrl && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {event.title}
          </h3>
          <Badge 
            variant="secondary" 
            className={categoryColors[event.category]}
          >
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              {format(new Date(event.startDate), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">
              {event.location.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">
              {event.organizer}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Ticket className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-foreground">
              {event.ticketPrice ? `LKR ${event.ticketPrice.toLocaleString()}` : 'Free'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}