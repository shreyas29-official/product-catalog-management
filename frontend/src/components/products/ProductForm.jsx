import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { getImageUrl } from '../../services/api';

export default function ProductForm({ initialData, onSubmit, loading, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    quantity: initialData?.quantity || '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(getImageUrl(initialData?.image));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('quantity', form.quantity);
    if (image) formData.append('image', image);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Price ($)" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
        <Input label="Quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100" />
        {preview && (
          <img src={preview} alt="Preview" className="mt-2 h-32 w-32 rounded-lg object-cover border" />
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
