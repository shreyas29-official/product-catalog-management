import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  placeOrder,
  getOrders,
  getOrderById,
  approveOrder,
  rejectOrder,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.get('/stats', authorize('admin'), getOrderStats);
router.get('/', getOrders);
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid order ID'), validate],
  getOrderById
);

router.post('/', authorize('client'), placeOrder);

router.patch(
  '/:id/approve',
  authorize('admin'),
  [param('id').isMongoId().withMessage('Invalid order ID'), validate],
  approveOrder
);

router.patch(
  '/:id/reject',
  authorize('admin'),
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('rejectionReason').optional().trim(),
    validate,
  ],
  rejectOrder
);

export default router;
