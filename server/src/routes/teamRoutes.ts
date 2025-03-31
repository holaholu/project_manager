import express from 'express';
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getTeamMembers)
  .post(protect, addTeamMember);

router.route('/:id')
  .put(protect, updateTeamMember)
  .delete(protect, deleteTeamMember);

export default router;
