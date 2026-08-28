// server/src/controllers/listingController.js
import Listing from '../models/Listing.js';
import { ok, fail } from '../utils/apiResponse.js';
import { publicListing } from '../utils/serialize.js';
import { validateListing } from '../validation/validators.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

const buildQuery = (q, user) => {
  const filter = {};
  if (q.category) filter.category = q.category;
  if (q.condition) filter.condition = q.condition;
  if (q.status) filter.status = q.status;
  else filter.status = 'active';
  if (q.seller) filter.seller = q.seller;
  if (q.location) filter.location = new RegExp(q.location, 'i');
  if (q.minPrice || q.maxPrice) {
    filter.price = {};
    if (q.minPrice) filter.price.$gte = Number(q.minPrice);
    if (q.maxPrice) filter.price.$lte = Number(q.maxPrice);
  }
  if (q.q) {
    const rx = new RegExp(q.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  if (q.saved === 'true' && user) filter._id = { $in: user.savedListings };
  return filter;
};

const SORTS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  oldest: { createdAt: 1 },
};

export async function listListings(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const filter = buildQuery(req.query, req.user);
    const sort = SORTS[req.query.sort] || SORTS.newest;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Listing.find(filter).populate('seller', 'name campus avatar verified').sort(sort).skip(skip).limit(limit).lean(),
      Listing.countDocuments(filter),
    ]);
    const viewerId = req.user?._id?.toString();
    return ok(res, items.map((l) => publicListing(l, viewerId)), {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (err) { next(err); }
}

export async function createListing(req, res, next) {
  try {
    const data = validateListing(req.body);
    const listing = await Listing.create({ ...data, seller: req.user._id });
    const populated = await listing.populate('seller', 'name campus avatar verified');
    return ok(res, publicListing(populated, req.user._id.toString()), null, 201);
  } catch (err) { next(err); }
}

export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name campus avatar verified');
    if (!listing) throw new NotFoundError('Listing not found');
    return ok(res, publicListing(listing, req.user?._id?.toString()));
  } catch (err) { next(err); }
}

export async function updateListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new NotFoundError('Listing not found');
    if (listing.seller.toString() !== req.user._id.toString()) throw new ForbiddenError('You can only edit your own listings');
    const data = validateListing({ ...listing.toObject(), ...req.body });
    Object.assign(listing, data);
    await listing.save();
    const populated = await listing.populate('seller', 'name campus avatar verified');
    return ok(res, publicListing(populated, req.user._id.toString()));
  } catch (err) { next(err); }
}

export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new NotFoundError('Listing not found');
    if (listing.seller.toString() !== req.user._id.toString()) throw new ForbiddenError('You can only remove your own listings');
    listing.status = 'removed';
    await listing.save();
    return ok(res, { id: listing._id });
  } catch (err) { next(err); }
}

export async function toggleSave(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new NotFoundError('Listing not found');
    const uid = req.user._id;
    const idx = listing.savedBy.indexOf(uid);
    let saved;
    if (idx >= 0) { listing.savedBy.splice(idx, 1); saved = false; }
    else { listing.savedBy.push(uid); saved = true; }
    await listing.save();
    const user = req.user;
    const u = user.savedListings.map((x) => x.toString());
    const ui = u.indexOf(listing._id.toString());
    if (saved && ui < 0) user.savedListings.push(listing._id);
    if (!saved && ui >= 0) user.savedListings.splice(ui, 1);
    await user.save();
    return ok(res, { saved });
  } catch (err) { next(err); }
}
