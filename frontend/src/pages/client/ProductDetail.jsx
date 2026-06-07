import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';
import { clientLinks } from '../../config/navigation';
import * as productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productService.getProductById(id);
        setProduct(data.data);
      } catch {
        navigate('/client/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      setMessage('Added to cart!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <DashboardLayout links={clientLinks}><LoadingSpinner size="lg" className="py-20" /></DashboardLayout>;
  if (!product) return null;

  const imageUrl = getImageUrl(product.image);

  return (
    <DashboardLayout links={clientLinks}>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {message && <Alert type={message.includes('Failed') ? 'error' : 'success'} message={message} onClose={() => setMessage('')} className="mb-6" />}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(product.price)}</p>
            <p className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {product.quantity > 0 && (
              <div className="flex items-end gap-4 pt-4">
                <Input label="Quantity" type="number" min="1" max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="max-w-[120px]" />
                <Button onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
