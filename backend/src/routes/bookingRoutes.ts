import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById } from '../controllers/bookingController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createBooking);
router.get('/my', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);

export default router;
