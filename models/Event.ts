import mongoose, { Schema, Document } from 'mongoose';
import { Event as EventType } from '@/types/event';

export interface EventDocument extends Omit<EventType, 'id'>, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  lastScraped: Date;
}

const EventSchema = new Schema<EventDocument>({
  title: {
    type: String,
    required: true,
    index: 'text'
  },
  description: {
    type: String,
    required: true,
    index: 'text'
  },
  startDate: {
    type: String,
    required: true,
    index: 1
  },
  endDate: {
    type: String,
    required: true
  },
  location: {
    name: {
      type: String,
      required: true,
      index: 'text'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere' // GeoJSON indexing for location-based queries
    },
    address: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['Tech', 'Conference', 'Workshop', 'Festival', 'Academic', 'Religious', 'Business', 'Sports'],
    index: 1
  },
  ticketPrice: {
    type: Number,
    default: null
  },
  sourceUrl: {
    type: String,
    required: true,
    unique: true // Prevent duplicate events from same source
  },
  organizer: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create compound indexes for efficient queries
EventSchema.index({ 'location.coordinates': '2dsphere', category: 1 });
EventSchema.index({ startDate: 1, category: 1 });
EventSchema.index({ title: 'text', description: 'text', 'location.name': 'text' });

export default mongoose.models.Event || mongoose.model<EventDocument>('Event', EventSchema);