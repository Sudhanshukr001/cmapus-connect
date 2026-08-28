// server/src/controllers/userController.js
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Event from '../models/Event.js';
import { ok } from '../utils/apiResponse.js';
import { publicUser, publicListing, publicEvent } from '../utils/serialize.js';
import { NotFoundError } from '../utils/errors.js';

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    return ok(res, publicUser(user));
  } catch (err) { next(err); }
}

export async function getSaved(req, res, next) {
  try {
    const u = req.user;
    const [listings, events] = await Promise.all([
      Listing.find({ _id: { $in: u.savedListings }, status: 'active' }).populate('seller', 'name campus avatar verified').lean(),
      Event.find({ _id: { $in: u.savedEvents } }).populate('organizer', 'name campus avatar verified').lean(),
    ]);
    const viewerId = u._id.toString();
    const mappedListings = listings.map((l) => publicListing(l, viewerId));
    const mappedEvents = await Promise.all(events.map(async (e) => {
      const rsvp = await (await import('../models/Rsvp.js')).default.findOne({ event: e._id, user: viewerId });
      return publicEvent(e, viewerId, rsvp?.status || null);
    }));
    return ok(res, { listings: mappedListings, events: mappedEvents, searches: u.savedSearches });
  } catch (err) { next(err); }
}

export async function saveSearch(req, res, next) {
  try {
    const { query, type } = req.body;
    if (!query) return ok(res, { error: 'query required' }, null, 400);
    req.user.savedSearches.unshift({ query, type: type === 'event' ? 'event' : 'listing' });
    req.user.savedSearches = req.user.savedSearches.slice(0, 20);
    await req.user.save();
    return ok(res, { searches: req.user.savedSearches });
  } catch (err) { next(err); }
}

export async function removeSavedSearch(req, res, next) {
  try {
    req.user.savedSearches = req.user.savedSearches.filter((s) => s._id.toString() !== req.params.id);
    await req.user.save();
    return ok(res, { searches: req.user.savedSearches });
  } catch (err) { next(err); }
}
