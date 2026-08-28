// server/src/routes/conversation.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listConversations, getOrCreateConversation, getConversation } from '../controllers/conversationController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/', asyncHandler(listConversations));
router.post('/', asyncHandler(getOrCreateConversation));
router.get('/:id', asyncHandler(getConversation));

export default router;
