// server/src/routes/search.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { search } from '../controllers/searchController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/', asyncHandler(search));

export default router;
