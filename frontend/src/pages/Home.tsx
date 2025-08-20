import { Link } from 'react-router-dom';
import { ShoppingBagIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          Welcome to <span className="text-primary-600">EcomStore</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/products" className="btn-primary text-lg px-8 py-3">
            Shop Now
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn-outline text-lg px-8 py-3">
              Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <ShoppingBagIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Selection</h3>
          <p className="text-gray-600">
            Browse through thousands of products across multiple categories and brands.
          </p>
        </div>
        
        <div className="card text-center">
          <UserGroupIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted by Many</h3>
          <p className="text-gray-600">
            Join thousands of satisfied customers who trust us for their shopping needs.
          </p>
        </div>
        
        <div className="card text-center">
          <CogIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Management</h3>
          <p className="text-gray-600">
            {isAdmin ? 'Manage your store with our powerful admin tools.' : 'Simple and intuitive shopping experience.'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      {isAuthenticated && (
        <div className="bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="btn-outline">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}