import Product from '../models/Product.js';
import ApiError from '../utilities/ApiError.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  const filename = path.basename(imagePath);
  const fullPath = path.join(__dirname, '..', 'uploads', filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export const createProduct = async (data, adminId, imageFile) => {
  const productData = {
    ...data,
    createdBy: adminId,
    image: imageFile ? `/uploads/${imageFile.filename}` : null,
  };
  return Product.create(productData);
};

export const getProducts = async ({
  page = 1,
  limit = 12,
  search = '',
  minPrice,
  maxPrice,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  adminId,
  activeOnly = true,
} = {}) => {
  const query = {};

  if (activeOnly) query.isActive = true;
  if (adminId) query.createdBy = adminId;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  const sortOptions = {};
  const allowedSortFields = ['name', 'price', 'quantity', 'createdAt'];
  sortOptions[allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'] =
    sortOrder === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate('createdBy', 'name email');
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const updateProduct = async (id, data, adminId, imageFile) => {
  const product = await Product.findOne({ _id: id, createdBy: adminId });
  if (!product) throw new ApiError(404, 'Product not found or unauthorized');

  if (imageFile) {
    deleteImageFile(product.image);
    data.image = `/uploads/${imageFile.filename}`;
  }

  Object.assign(product, data);
  await product.save();
  return product;
};

export const deleteProduct = async (id, adminId) => {
  const product = await Product.findOne({ _id: id, createdBy: adminId });
  if (!product) throw new ApiError(404, 'Product not found or unauthorized');

  deleteImageFile(product.image);
  await product.deleteOne();
  return product;
};

export const getProductStats = async (adminId) => {
  const query = adminId ? { createdBy: adminId } : {};
  const [total, active, outOfStock] = await Promise.all([
    Product.countDocuments(query),
    Product.countDocuments({ ...query, isActive: true }),
    Product.countDocuments({ ...query, quantity: 0 }),
  ]);
  return { total, active, outOfStock };
};
