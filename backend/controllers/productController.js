import * as productService from '../services/productService.js';
import catchAsync from '../utilities/catchAsync.js';

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(
    req.body,
    req.user._id,
    req.file
  );
  res.status(201).json({ success: true, data: product });
});

export const getProducts = catchAsync(async (req, res) => {
  const isAdmin = req.user?.role === 'admin';
  const result = await productService.getProducts({
    ...req.query,
    adminId: isAdmin && req.query.mine === 'true' ? req.user._id : undefined,
    activeOnly: req.query.activeOnly !== 'false',
  });
  res.json({ success: true, data: result });
});

export const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json({ success: true, data: product });
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.user._id,
    req.file
  );
  res.json({ success: true, data: product });
});

export const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id, req.user._id);
  res.json({ success: true, message: 'Product deleted successfully' });
});

export const getProductStats = catchAsync(async (req, res) => {
  const stats = await productService.getProductStats(req.user._id);
  res.json({ success: true, data: stats });
});
