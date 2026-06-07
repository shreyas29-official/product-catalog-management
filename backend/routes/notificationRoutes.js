import { Router } from 'express';
import { param } from 'express-validator';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch(
  '/:id/read',
  [param('id').isMongoId().withMessage('Invalid notification ID'), validate],
  markAsRead
);
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid notification ID'), validate],
  deleteNotification
);

export default router;
