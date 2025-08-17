'use client';

import { Event } from '@/types/event';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Users, Ticket, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface EventDetailsProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function EventDetails({ event, open, onOpenChange }: EventDetailsProps) {
  if (!event) return null;

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-bold leading-tight pr-8">
              {event.title}
            </DialogTitle>
            <Badge 
              variant="secondary" 
              className={categoryColors[event.category]}
            >
              {event.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          {event.imageUrl && (
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(startDate, 'EEEE, MMMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                    {!isSameDay && ` (+1 day)`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.location.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Organizer</p>
                  <p className="text-sm text-muted-foreground">
                    {event.organizer}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Ticket Price</p>
                  <p className="text-sm font-medium text-foreground">
                    {event.ticketPrice ? `LKR ${event.ticketPrice.toLocaleString()}` : 'Free Event'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3">About This Event</h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button asChild className="flex-1">
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Event Details
              </a>
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}