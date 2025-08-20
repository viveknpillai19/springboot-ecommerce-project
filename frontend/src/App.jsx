import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';

// Import all necessary components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import all page components
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminOrderManagement from './pages/AdminOrderManagement';
import ProfilePage from './pages/ProfilePage';

// This component defines the main layout with the Navbar
const AppLayout = () => (
  <>
    <Navbar />
    <Container sx={{ mt: 4 }}>
      {/* The Outlet component renders the matched child route's component */}
      <Outlet />
    </Container>
  </>
);

// This is the main router configuration for the entire application
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    // These are the general user-facing pages
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "orders", element: <OrderHistoryPage /> },
            {
        element: <ProtectedRoute />, // This protects all child routes below
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "orders", element: <OrderHistoryPage /> },
          { path: "profile", element: <ProfilePage /> }, // Add this protected route
        ],
      },
    ],
  },
  // This is a separate route structure for the admin dashboard
  {
    path: "/admin",
    // This ProtectedRoute component will check if the user is an admin
    element: <ProtectedRoute adminOnly={true} />,
    children: [
      {
        path: "orders", // This page will be accessible at /admin/orders
        element: <AdminOrderManagement />
      },
      // You can add more admin pages here later, like /admin/users or /admin/products
    ],
  },
]);

function App() {
  // The RouterProvider component makes the router available to the whole app
  return <RouterProvider router={router} />;
}

export default App;