// server/src/models/Rsvp.js
import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['going', 'interested', 'cancelled'], default: 'going' },
  },
  { timestamps: true }
);

rsvpSchema.index({ event: 1, user: 1 }, { unique: true });

const Rsvp = mongoose.model('Rsvp', rsvpSchema);
export default Rsvp;
