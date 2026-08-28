// server/src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    campus: { type: String, default: 'Campus' },
    avatar: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    savedSearches: [
      {
        query: String,
        type: { type: String, enum: ['listing', 'event'], default: 'listing' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
