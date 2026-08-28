// server/src/controllers/eventController.js
import Event from '../models/Event.js';
import Rsvp from '../models/Rsvp.js';
import { ok, fail } from '../utils/apiResponse.js';
import { publicEvent } from '../utils/serialize.js';
import { validateEvent } from '../validation/validators.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

const buildQuery = (q) => {
  const filter = {};
  if (q.category) filter.category = q.category;
  if (q.location) filter.location = new RegExp(q.location, 'i');
  if (q.q) {
    const rx = new RegExp(q.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  if (q.when === 'past') filter.startTime = { $lt: new Date() };
  else if (q.when === 'upcoming' || !q.when) filter.startTime = { $gte: new Date() };
  return filter;
};

export async function listEvents(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const filter = buildQuery(req.query);
    const sort = req.query.when === 'past' ? { startTime: -1 } : { startTime: 1 };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Event.find(filter).populate('organizer', 'name campus avatar verified').sort(sort).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);
    const viewerId = req.user?._id?.toString();
    const out = await Promise.all(items.map(async (e) => {
      const rsvp = viewerId ? await Rsvp.findOne({ event: e._id, user: viewerId }) : null;
      return publicEvent(e, viewerId, rsvp?.status || null);
    }));
    return ok(res, out, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
}

export async function createEvent(req, res, next) {
  try {
    const data = validateEvent(req.body);
    const event = await Event.create({ ...data, organizer: req.user._id });
    const populated = await event.populate('organizer', 'name campus avatar verified');
    return ok(res, publicEvent(populated, req.user._id.toString(), 'going'), null, 201);
  } catch (err) { next(err); }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name campus avatar verified');
    if (!event) throw new NotFoundError('Event not found');
    const viewerId = req.user?._id?.toString();
    const rsvp = viewerId ? await Rsvp.findOne({ event: event._id, user: viewerId }) : null;
    return ok(res, publicEvent(event, viewerId, rsvp?.status || null));
  } catch (err) { next(err); }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError('Event not found');
    if (event.organizer.toString() !== req.user._id.toString()) throw new ForbiddenError('Only the organizer can edit');
    const data = validateEvent({ ...event.toObject(), ...req.body });
    Object.assign(event, data);
    await event.save();
    const populated = await event.populate('organizer', 'name campus avatar verified');
    return ok(res, publicEvent(populated, req.user._id.toString()));
  } catch (err) { next(err); }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError('Event not found');
    if (event.organizer.toString() !== req.user._id.toString()) throw new ForbiddenError('Only the organizer can delete');
    await Rsvp.deleteMany({ event: event._id });
    await event.deleteOne();
    return ok(res, { id: event._id });
  } catch (err) { next(err); }
}

export async function rsvp(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError('Event not found');
    const status = req.body?.status === 'interested' ? 'interested' : 'going';
    const uid = req.user._id;
    let rsvp = await Rsvp.findOne({ event: event._id, user: uid });
    let nextCount = event.attendeeCount;

    if (!rsvp) {
      rsvp = await Rsvp.create({ event: event._id, user: uid, status });
      if (status === 'going') nextCount += 1;
    } else if (rsvp.status === status) {
      rsvp.status = 'cancelled';
      if (status === 'going') nextCount = Math.max(0, nextCount - 1);
    } else {
      if (status === 'going' && rsvp.status !== 'going') nextCount += 1;
      if (status !== 'going' && rsvp.status === 'going') nextCount = Math.max(0, nextCount - 1);
      rsvp.status = status;
    }
    await rsvp.save();
    event.attendeeCount = nextCount;
    await event.save();

    const io = req.app.get('io');
    if (io) io.to(`event:${event._id}`).emit('rsvp:update', { eventId: event._id, attendeeCount: nextCount, status: rsvp.status, userId: uid });

    return ok(res, { status: rsvp.status, attendeeCount: nextCount });
  } catch (err) { next(err); }
}

export async function toggleSaveEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError('Event not found');
    const user = req.user;
    const idx = user.savedEvents.map(String).indexOf(event._id.toString());
    let saved;
    if (idx >= 0) { user.savedEvents.splice(idx, 1); saved = false; }
    else { user.savedEvents.push(event._id); saved = true; }
    await user.save();
    return ok(res, { saved });
  } catch (err) { next(err); }
}

export async function attendees(req, res, next) {
  try {
    const rsvps = await Rsvp.find({ event: req.params.id, status: 'going' }).populate('user', 'name campus avatar verified').limit(50).lean();
    return ok(res, rsvps.map((r) => r.user));
  } catch (err) { next(err); }
}
