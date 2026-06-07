import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProductCard from '../../components/products/ProductCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { clientLinks } from '../../config/navigation';
import * as productService from '../../services/productService';
import { useCart } from '../../context/CartContext';

export default function ClientProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    search: '', sortBy: 'createdAt', sortOrder: 'desc', minPrice: '', maxPrice: '', page: 1,
  });
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 12 };
      if (!params.minPrice) delete params.minPrice;
      if (!params.maxPrice) delete params.maxPrice;
      const { data } = await productService.getProducts(params);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <DashboardLayout links={clientLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Browse and shop available products</p>
        </div>

        {message && <Alert type={message.includes('Failed') ? 'error' : 'success'} message={message} onClose={() => setMessage('')} />}

        <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Input placeholder="Search..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="max-w-xs" />
          <Input placeholder="Min price" type="number" value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
            className="max-w-[120px]" />
          <Input placeholder="Max price" type="number" value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
            className="max-w-[120px]" />
          <Select value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            options={[
              { value: 'createdAt', label: 'Date' },
              { value: 'name', label: 'Name' },
              { value: 'price', label: 'Price' },
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
          <p className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">No products found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        <Pagination page={pagination.page} pages={pagination.pages}
          onPageChange={(page) => setFilters({ ...filters, page })} />
      </div>
    </DashboardLayout>
  );
}
