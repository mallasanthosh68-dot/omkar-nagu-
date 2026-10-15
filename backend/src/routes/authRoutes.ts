import { Router } from 'express';
import { register, login, adminLogin, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', requireAuth, getMe);

export default router;
