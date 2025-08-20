// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function Navbar() {
  // Get the token AND the user object from the context
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          SpringCommerce
        </Typography>
        
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          
          {token ? (
            // --- UPDATED LOGIC FOR LOGGED-IN USERS ---
            <>
              <Button color="inherit" component={Link} to="/cart">Cart</Button>
              <Button color="inherit" component={Link} to="/orders">My Orders</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>

              {/* Conditionally render the Admin button */}
              {user?.roles?.includes('ROLE_ADMIN') && (
                <Button color="inherit" component={Link} to="/admin/orders">
                  Admin
                </Button>
              )}

              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            // If user is not logged in, show Login button
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;