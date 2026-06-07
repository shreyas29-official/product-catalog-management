import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProductCard from '../../components/products/ProductCard';
import ProductForm from '../../components/products/ProductForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { adminLinks } from '../../config/navigation';
import * as productService from '../../services/productService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    search: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getProducts({ ...filters, mine: 'true', limit: 12 });
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData);
        setSuccess('Product updated successfully');
      } else {
        await productService.createProduct(formData);
        setSuccess('Product created successfully');
      }
      setModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      setSuccess('Product deleted');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout links={adminLinks}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500">Manage your product catalog</p>
          </div>
          <Button onClick={() => { setEditingProduct(null); setModalOpen(true); }}>
            + Add Product
          </Button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Input placeholder="Search products..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="max-w-xs" />
          <Select value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            options={[
              { value: 'createdAt', label: 'Date' },
              { value: 'name', label: 'Name' },
              { value: 'price', label: 'Price' },
              { value: 'quantity', label: 'Quantity' },
            ]} />
          <Select value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
            options={[
              { value: 'desc', label: 'Descending' },
              { value: 'asc', label: 'Ascending' },
            ]} />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : products.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
            No products found. Create your first product!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard product={product} showActions={false} linkPrefix="/admin/products" />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1"
                    onClick={() => { setEditingProduct(product); setModalOpen(true); }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" className="flex-1"
                    onClick={() => handleDelete(product._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={pagination.page} pages={pagination.pages}
          onPageChange={(page) => setFilters({ ...filters, page })} />

        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingProduct(null); }}
          title={editingProduct ? 'Edit Product' : 'Create Product'} size="lg">
          <ProductForm initialData={editingProduct} onSubmit={handleSubmit} loading={submitting}
            onCancel={() => { setModalOpen(false); setEditingProduct(null); }} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
