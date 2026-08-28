// server/src/models/Listing.js
import mongoose from 'mongoose';

const LISTING_CATEGORIES = [
  'books', 'electronics', 'furniture', 'bicycles', 'hostel',
  'clothing', 'tickets', 'services', 'other',
];

const CONDITION = ['new', 'like-new', 'good', 'fair', 'poor'];

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: LISTING_CATEGORIES, required: true, index: true },
    condition: { type: String, enum: CONDITION, default: 'good' },
    images: { type: [String], default: [] },
    location: { type: String, default: '' },
    status: { type: String, enum: ['active', 'sold', 'removed'], default: 'active', index: true },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

listingSchema.index({ createdAt: -1 });
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ title: 'text', description: 'text' });

listingSchema.statics.CATEGORIES = LISTING_CATEGORIES;
listingSchema.statics.CONDITIONS = CONDITION;

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
