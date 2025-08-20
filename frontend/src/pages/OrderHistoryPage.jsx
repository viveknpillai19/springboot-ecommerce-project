// src/pages/OrderHistoryPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../services/apiClient';
import { 
  Typography, Box, CircularProgress, Accordion, AccordionSummary, 
  AccordionDetails, List, ListItem, ListItemText 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      if (token) {
        try {
          const ordersData = await fetchOrders(token);
          setOrders(ordersData);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    getOrders();
  }, [token]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Your Order History</Typography>
      {orders.length === 0 ? (
        <Typography>You have not placed any orders yet.</Typography>
      ) : (
        orders.map(order => (
          <Accordion key={order.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Order #{order.id}
              </Typography>
              <Typography sx={{ color: 'text.secondary', width: '33%' }}>
                Date: {new Date(order.orderDate).toLocaleDateString()}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Total: ${order.totalPrice.toFixed(2)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6">Items:</Typography>
              <List>
                {order.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`${item.productName} (x${item.quantity})`} 
                      secondary={`Price: $${item.price.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Shipping Address: {order.shippingAddress}
              </Typography>
              <Typography variant="subtitle1">
                Status: {order.status}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}

export default OrderHistoryPage;