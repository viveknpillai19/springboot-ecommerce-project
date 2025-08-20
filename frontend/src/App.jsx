import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;