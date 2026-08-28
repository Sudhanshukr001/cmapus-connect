// server/src/models/Event.js
import mongoose from 'mongoose';

const EVENT_CATEGORIES = ['social', 'academic', 'clubs', 'sports', 'career', 'arts'];

const eventSchema = new mongoose.Schema(
  {
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, enum: EVENT_CATEGORIES, required: true, index: true },
    location: { type: String, default: '' },
    cover: { type: String, default: '' },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    attendeeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ startTime: 1 });
eventSchema.statics.CATEGORIES = EVENT_CATEGORIES;

const Event = mongoose.model('Event', eventSchema);
export default Event;
