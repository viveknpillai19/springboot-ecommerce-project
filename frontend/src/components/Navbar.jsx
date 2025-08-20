import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State and handlers for the Admin dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isAdminMenuOpen = Boolean(anchorEl);

  const handleAdminMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Site Title - Stays on the far left */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 700,
            textDecoration: 'none', 
            color: 'inherit',
          }}
        >
          LOOMA
        </Typography>
        
        {/* This flexible spacer pushes everything that follows it to the right */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Container for all right-aligned items */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Search bar is now the first item on the right */}
          <SearchBar />

          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          
          {token ? (
            // Links for LOGGED-IN users
            <>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" component={Link} to="/cart">Cart</Button>
              <Button color="inherit" component={Link} to="/orders">My Orders</Button>

              {/* Admin dropdown menu */}
              {user?.roles?.includes('ROLE_ADMIN') && (
                <>
                  <Button
                    color="inherit"
                    onClick={handleAdminMenuClick}
                  >
                    Admin
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={isAdminMenuOpen}
                    onClose={handleAdminMenuClose}
                  >
                    <MenuItem onClick={handleAdminMenuClose} component={Link} to="/admin/orders">Manage Orders</MenuItem>
                    <MenuItem onClick={handleAdminMenuClose} component={Link} to="/admin/products">Manage Products</MenuItem>
                  </Menu>
                </>
              )}

              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            // Link for LOGGED-OUT users
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;