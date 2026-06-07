import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect, authorize('client'));

router.get('/', getCart);

router.post(
  '/',
  [
    body('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
  addToCart
);

router.put(
  '/:productId',
  [
    param('productId').isMongoId().withMessage('Valid product ID is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
    validate,
  ],
  updateCartItem
);

router.delete(
  '/:productId',
  [param('productId').isMongoId().withMessage('Valid product ID is required'), validate],
  removeFromCart
);

router.delete('/', clearCart);

export default router;
