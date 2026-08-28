// server/src/routes/message.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/:id/messages', asyncHandler(listMessages));
router.post('/:id/messages', asyncHandler(sendMessage));

export default router;
