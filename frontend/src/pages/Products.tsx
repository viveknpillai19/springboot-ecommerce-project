import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/Products/ProductGrid';
import { Product } from '../types';

export default function Products() {
  const { data: products, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality
    alert(`Added ${product.name} to cart!`);
  };

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Failed to load products</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full sm:w-80"
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
    </div>
  );
}