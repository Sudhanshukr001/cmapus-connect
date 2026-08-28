// server/src/routes/event.routes.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  listEvents, createEvent, getEvent, updateEvent, deleteEvent, rsvp, attendees, toggleSaveEvent,
} from '../controllers/eventController.js';

const router = express.Router();
router.use(requireAuth);
router.get('/', asyncHandler(listEvents));
router.post('/', asyncHandler(createEvent));
router.get('/:id', asyncHandler(getEvent));
router.patch('/:id', asyncHandler(updateEvent));
router.delete('/:id', asyncHandler(deleteEvent));
router.post('/:id/rsvp', asyncHandler(rsvp));
router.get('/:id/attendees', asyncHandler(attendees));
router.post('/:id/save', asyncHandler(toggleSaveEvent));

export default router;
