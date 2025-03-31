import express from 'express';
import {
  register,
  login,
  getProfile,
  changePassword,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/profile')
  .get(protect, getProfile);

router.post('/change-password', protect, changePassword);

export default router;
