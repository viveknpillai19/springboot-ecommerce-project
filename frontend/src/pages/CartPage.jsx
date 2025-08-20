// src/pages/CartPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Box, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, CircularProgress, 
  Snackbar, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

function CartPage() {
  const { cart, removeFromCart, placeOrder } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePlaceOrder = async () => {
    try {
      const successMessage = await placeOrder();
      setSuccess(successMessage);
      // Redirect to home page after a short delay to show the success message
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  if (!cart) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Your Shopping Cart</Typography>
      {cart.items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeFromCart(item.productId)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell colSpan={2} />
                  <TableCell align="right"><Typography variant="h6">Total</Typography></TableCell>
                  <TableCell align="right"><Typography variant="h6">${cart.totalPrice.toFixed(2)}</Typography></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handlePlaceOrder}
              disabled={cart.items.length === 0}
            >
              Place Order (Cash on Delivery)
            </Button>
          </Box>
        </>
      )}
      {/* Success Notification */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      {/* Error Notification */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CartPage;