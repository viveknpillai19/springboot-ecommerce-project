import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { isAuthenticated, email, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
              isAdmin 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isAdmin ? 'Administrator' : 'User'}
            </span>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
          <p className="text-sm text-gray-600">
            Profile management features will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}