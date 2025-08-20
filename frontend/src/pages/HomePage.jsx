// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/apiClient';
import ProductCard from '../components/ProductCard';
import { Box, Typography, Grid, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function HomePage() {
  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProducts();
      // Group products by category
      const grouped = productsData.reduce((acc, product) => {
        const category = product.categoryName || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {});
      setGroupedProducts(grouped);
    };
    getProducts();
  }, []);

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Site Name */}
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        ClickCart
      </Typography>
      
      {/* Search Bar */}
      <Box sx={{ my: 4, maxWidth: '600px', mx: 'auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for products..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Products by Category */}
      <Box sx={{ textAlign: 'left', mt: 6 }}>
        {Object.entries(groupedProducts).map(([category, products]) => (
          <Box key={category} sx={{ mb: 5 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {category}
            </Typography>
            <Grid container spacing={4}>
              {products.slice(0, 2).map((product) => ( // Show up to 2 products per category
                <Grid key={product.id} xs={12} sm={6} md={4}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default HomePage;