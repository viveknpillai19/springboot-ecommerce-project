import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  loginUser, 
  registerUser, 
  getCart, 
  addItemToCart, 
  removeItemFromCart, 
  placeOrder 
} from '../services/apiClient';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export function AuthProvider({ children }) {
  // --- STATE ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Holds decoded user info like email and roles
  const [cart, setCart] = useState(null);

  // --- HELPER FUNCTIONS ---
  const fetchCart = useCallback(async (currentToken) => {
    if (currentToken) {
      try {
        const cartData = await getCart(currentToken);
        setCart(cartData);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (error.message.includes('401') || error.message.includes('403')) {
          logout(); // Log out if token is invalid
        }
      }
    }
  }, []);


  // --- EFFECTS ---
  // This effect runs whenever the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      fetchCart(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setCart(null); // Clear cart on logout
    }
  }, [token, fetchCart]);


  // --- CONTEXT FUNCTIONS ---
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
      fetchCart(token); // Refresh cart after adding
      alert('Item added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item. It may be out of stock.');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeItemFromCart(productId, token);
      fetchCart(token); // Refresh cart after removing
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const placeOrder = async () => {
    try {
      const successMessage = await placeOrder(token);
      fetchCart(token); // Refresh the cart, which will now be empty
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

// 3. Create a custom hook to easily use the context
export function useAuth() {
  return useContext(AuthContext);
}