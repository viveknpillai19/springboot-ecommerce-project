import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAllOrders, updateOrderStatus } from '../services/apiClient';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button } from '@mui/material';

function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();

  const getOrders = async () => {
    const ordersData = await fetchAllOrders(token);
    setOrders(ordersData);
  };

  useEffect(() => {
    if (token) getOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus, token);
    getOrders(); // Refresh the list
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage All Orders</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Email</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{/* We need to add customer email to OrderResponse in backend */}</TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <MenuItem value="PROCESSING">Processing</MenuItem>
                    <MenuItem value="SHIPPED">Shipped</MenuItem>
                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminOrderManagement;