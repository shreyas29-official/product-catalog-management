import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStats,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', protect, getProducts);
router.get('/stats', protect, authorize('admin'), getProductStats);
router.get(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid product ID'), validate],
  getProductById
);

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
    validate,
  ],
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('image'),
  [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('quantity').optional().isInt({ min: 0 }),
    validate,
  ],
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  [param('id').isMongoId().withMessage('Invalid product ID'), validate],
  deleteProduct
);

export default router;
