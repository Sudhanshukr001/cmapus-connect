// server/src/controllers/searchController.js
import Listing from '../models/Listing.js';
import Event from '../models/Event.js';
import { ok } from '../utils/apiResponse.js';
import { publicListing, publicEvent } from '../utils/serialize.js';

export async function search(req, res, next) {
  try {
    const q = (req.query.q || '').toString().trim();
    if (!q) return ok(res, { listings: [], events: [] });
    const viewerId = req.user?._id?.toString();
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const [listings, events] = await Promise.all([
      Listing.find({ status: 'active', $or: [{ title: rx }, { description: rx }] })
        .populate('seller', 'name campus avatar verified').limit(20).lean(),
      Event.find({ startTime: { $gte: new Date() }, $or: [{ title: rx }, { description: rx }] })
        .populate('organizer', 'name campus avatar verified').limit(20).lean(),
    ]);
    const Rsvp = (await import('../models/Rsvp.js')).default;
    const mappedEvents = await Promise.all(events.map(async (e) => {
      const rsvp = viewerId ? await Rsvp.findOne({ event: e._id, user: viewerId }) : null;
      return publicEvent(e, viewerId, rsvp?.status || null);
    }));
    return ok(res, {
      listings: listings.map((l) => publicListing(l, viewerId)),
      events: mappedEvents,
    });
  } catch (err) { next(err); }
}
