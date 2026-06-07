import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import Button from '../ui/Button';

export default function ProductCard({ product, onAddToCart, showActions = true, linkPrefix = '/client/products' }) {
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`${linkPrefix}/${product._id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`${linkPrefix}/${product._id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(product.price)}
          </span>
          <span className={`text-xs ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        {showActions && onAddToCart && product.quantity > 0 && (
          <Button
            className="mt-3 w-full"
            size="sm"
            onClick={() => onAddToCart(product._id)}
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
