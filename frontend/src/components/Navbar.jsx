import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Site Title - always visible */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          ClickCart
        </Typography>
        
        {/* Navigation Links Box */}
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          
          {token ? (
            // --- Links for LOGGED-IN users ---
            <>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" component={Link} to="/cart">Cart</Button>
              <Button color="inherit" component={Link} to="/orders">My Orders</Button>

              {/* Conditionally render Admin links */}
              {user?.roles?.includes('ROLE_ADMIN') && (
                <>
                  <Button color="inherit" component={Link} to="/admin/orders">Manage Orders</Button>
                  <Button color="inherit" component={Link} to="/admin/products">Manage Products</Button>
                </>
              )}

              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            // --- Link for LOGGED-OUT users ---
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;