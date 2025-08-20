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
import ProfilePage from './pages/ProfilePage';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminProductManagement from './pages/AdminProductManagement'; // <-- 1. Add this import

const AppLayout = () => (
  <>
    <Navbar />
    <Container sx={{ mt: 4 }}>
      <Outlet />
    </Container>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "cart", element: <CartPage /> },
          { path: "orders", element: <OrderHistoryPage /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute adminOnly={true} />,
    children: [
      { path: "orders", element: <AdminOrderManagement /> },
      { path: "products", element: <AdminProductManagement /> }, // <-- 2. Add this route
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;