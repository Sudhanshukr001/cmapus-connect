// server/src/routes/user.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getProfile, getSaved, saveSearch, removeSavedSearch } from '../controllers/userController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/me', requireAuth, (req, res) => res.json({ success: true, data: require('../utils/serialize.js').publicUser(req.user) }));
router.get('/profile/:id', asyncHandler(getProfile));
router.get('/saved', asyncHandler(getSaved));
router.post('/saved/search', asyncHandler(saveSearch));
router.delete('/saved/search/:id', asyncHandler(removeSavedSearch));

export default router;
