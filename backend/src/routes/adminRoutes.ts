import { Router } from 'express';
import {
  getDashboardStats,
  getAdminBookings,
  getAdminBookingDetails,
  updateBookingStatus,
  getCustomersList,
  getCustomerDetails
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with authentication and ADMIN role check
router.use(requireAuth, requireAdmin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/bookings', getAdminBookings);
router.get('/bookings/:id', getAdminBookingDetails);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/customers', getCustomersList);
router.get('/customers/:id', getCustomerDetails);

export default router;
