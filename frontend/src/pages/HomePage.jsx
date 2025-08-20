import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Box, Typography, Grid, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function HomePage() {
  const { filteredProducts, searchTerm, setSearchTerm } = useAuth();

  return (
    <Box>
      {/* --- Top Section with Title and Search Bar --- */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontFamily: "'Raleway', sans-serif" 
          }}
        >
          {/* Updated Application Name */}
          LOOMA
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {/* Updated Tagline */}
          Shop Better. Live Better.
        </Typography>
        <Box sx={{ my: 4, maxWidth: '600px', mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* --- Product Grid --- */}
      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={2.4} sx={{ display: 'flex' }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomePage;