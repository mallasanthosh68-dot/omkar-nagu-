import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById } from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createBooking);
router.get('/my', requireAuth, getMyBookings);
router.get('/:id', requireAuth, getBookingById);

export default router;
