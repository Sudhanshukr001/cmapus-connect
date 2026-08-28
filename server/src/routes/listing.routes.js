// server/src/routes/listing.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  listListings, createListing, getListing, updateListing, deleteListing, toggleSave,
} from '../controllers/listingController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/', asyncHandler(listListings));
router.post('/', asyncHandler(createListing));
router.get('/:id', asyncHandler(getListing));
router.patch('/:id', asyncHandler(updateListing));
router.delete('/:id', asyncHandler(deleteListing));
router.post('/:id/save', asyncHandler(toggleSave));

export default router;
