import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  fetchProducts,
  loginUser, 
  registerUser, 
  getCart, 
  addItemToCart, 
  removeItemFromCart, 
  placeOrder 
} from '../services/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // === STATE MANAGEMENT ===
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  // Cart State
  const [cart, setCart] = useState(null);
  // Product & Search State
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // === HELPER FUNCTIONS ===
  const fetchCart = useCallback(async (currentToken) => {
    if (currentToken) {
      try {
        const cartData = await getCart(currentToken);
        setCart(cartData);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (error.message.includes('401') || error.message.includes('403')) {
          logout();
        }
      }
    }
  }, []);

  // === EFFECTS ===

  // Effect to handle token changes (login/logout)
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      fetchCart(token); // Fetch cart when user logs in
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setCart(null); // Clear cart on logout
    }
  }, [token, fetchCart]);

  // Effect to fetch all products once on initial app load
  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProducts();
      setAllProducts(productsData);
      setFilteredProducts(productsData);
    };
    getProducts();
  }, []);

  // Effect to filter products when search term changes
  useEffect(() => {
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, allProducts]);

  // === CONTEXT FUNCTIONS ===

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      setToken(data.token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
  };

  const register = async (name, email, password) => {
    try {
      await registerUser(name, email, password);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      await addItemToCart(productId, quantity, token);
      fetchCart(token);
      alert('Item added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item. It may be out of stock.');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeItemFromCart(productId, token);
      fetchCart(token);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const placeOrder = async () => {
    try {
      const successMessage = await placeOrder(token);
      fetchCart(token);
      return successMessage;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  };

  // The value provided to all consumer components
  const value = {
    token,
    user,
    cart,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    login,
    logout,
    register,
    addToCart,
    removeFromCart,
    placeOrder
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily use the context
export function useAuth() {
  return useContext(AuthContext);
}