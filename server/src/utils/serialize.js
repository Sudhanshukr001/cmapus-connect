// server/src/utils/serialize.js
import { avatarFor } from './avatar.js';

export function publicUser(u, extra = {}) {
  const obj = u.toObject ? u.toObject() : u;
  const { passwordHash, savedListings, savedEvents, savedSearches, ...rest } = obj;
  return {
    ...rest,
    initials: avatarFor(rest.name, rest._id?.toString()).letter,
    color: avatarFor(rest.name, rest._id?.toString()).bg,
    ...extra,
  };
}

export function publicListing(l, viewerId = null) {
  const obj = l.toObject ? l.toObject() : l;
  const seller = obj.seller && typeof obj.seller === 'object' ? publicUserLite(obj.seller) : obj.seller;
  return {
    ...obj,
    seller,
    saved: viewerId ? (obj.savedBy || []).some((id) => id?.toString() === viewerId) : false,
  };
}

export function publicUserLite(u) {
  const obj = u.toObject ? u.toObject() : u;
  const id = obj._id?.toString();
  return {
    _id: obj._id,
    name: obj.name,
    campus: obj.campus,
    avatar: obj.avatar,
    verified: obj.verified,
    initials: avatarFor(obj.name, id).letter,
    color: avatarFor(obj.name, id).bg,
  };
}

export function publicEvent(e, viewerId = null, viewerStatus = null) {
  const obj = e.toObject ? e.toObject() : e;
  const organizer = obj.organizer && typeof obj.organizer === 'object' ? publicUserLite(obj.organizer) : obj.organizer;
  return {
    ...obj,
    organizer,
    going: viewerStatus ? viewerStatus === 'going' : false,
    viewerStatus: viewerStatus || null,
  };
}
