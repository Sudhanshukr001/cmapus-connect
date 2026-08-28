// server/src/controllers/conversationController.js
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { ok } from '../utils/apiResponse.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { publicUserLite } from '../utils/serialize.js';

export async function listConversations(req, res, next) {
  try {
    const uid = req.user._id;
    const convos = await Conversation.find({ participants: uid })
      .populate('participants', 'name campus avatar verified')
      .populate('listing', 'title price images')
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean();

    const withMeta = await Promise.all(convos.map(async (c) => {
      const other = c.participants.find((p) => p._id.toString() !== uid.toString());
      const unread = await Message.countDocuments({ conversation: c._id, readBy: { $ne: uid } });
      return { ...c, other, unread };
    }));
    return ok(res, withMeta);
  } catch (err) { next(err); }
}

export async function getOrCreateConversation(req, res, next) {
  try {
    const uid = req.user._id;
    const { participantId, listingId } = req.body;
    if (!participantId) return ok(res, { error: 'participantId required' }, null, 400);
    const participantIds = [uid.toString(), participantId].sort();
    let convo = await Conversation.findOne({
      participants: { $all: participantIds, $size: 2 },
      ...(listingId ? { listing: listingId } : { listing: null }),
    });
    if (!convo) {
      convo = await Conversation.create({ participants: participantIds, listing: listingId || null });
    }
    convo = await Conversation.findById(convo._id)
      .populate('participants', 'name campus avatar verified')
      .populate('listing', 'title price images');
    return ok(res, convo, null, convo ? 200 : 201);
  } catch (err) { next(err); }
}

export async function getConversation(req, res, next) {
  try {
    const convo = await Conversation.findById(req.params.id)
      .populate('participants', 'name campus avatar verified')
      .populate('listing', 'title price images seller');
    if (!convo) throw new NotFoundError('Conversation not found');
    if (!convo.participants.some((p) => p._id.toString() === req.user._id.toString())) {
      throw new ForbiddenError('Not a participant');
    }
    return ok(res, convo);
  } catch (err) { next(err); }
}
