// server/src/controllers/messageController.js
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { ok } from '../utils/apiResponse.js';
import { publicUserLite } from '../utils/serialize.js';
import { validateMessage } from '../validation/validators.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export async function listMessages(req, res, next) {
  try {
    const convo = await Conversation.findById(req.params.id);
    if (!convo || !convo.participants.map(String).includes(req.user._id.toString())) {
      throw new ForbiddenError('Not a participant');
    }
    const limit = Math.min(100, Number(req.query.limit) || 50);
    const before = req.query.before ? new Date(req.query.before) : new Date();
    const messages = await Message.find({ conversation: req.params.id, createdAt: { $lt: before } })
      .sort({ createdAt: -1 }).limit(limit).lean();
    // mark read
    await Message.updateMany(
      { conversation: req.params.id, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id }, $setOnInsert: { readAt: new Date() } }
    );
    return ok(res, messages.reverse(), { hasMore: messages.length === limit });
  } catch (err) { next(err); }
}

export async function sendMessage(req, res, next) {
  try {
    const convo = await Conversation.findById(req.params.id);
    if (!convo || !convo.participants.map(String).includes(req.user._id.toString())) {
      throw new ForbiddenError('Not a participant');
    }
    const data = validateMessage(req.body);
    const message = await Message.create({
      conversation: convo._id,
      sender: req.user._id,
      body: data.body,
      attachments: data.attachments,
    });
    convo.lastMessage = data.body || (data.attachments.length ? '📎 Photo' : '');
    convo.lastMessageAt = new Date();
    await convo.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${convo._id}`).emit('message', {
        ...message.toObject(),
        sender: publicUserLite(req.user),
      });
    }
    return ok(res, message, null, 201);
  } catch (err) { next(err); }
}
