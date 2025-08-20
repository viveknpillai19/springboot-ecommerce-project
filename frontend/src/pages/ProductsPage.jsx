// src/pages/ProductsPage.jsx
import { useAuth } from '../context/AuthContext'; // Import useAuth
import ProductCard from '../components/ProductCard';
import { Grid, Typography } from '@mui/material';

function ProductsPage() {
  // Get the globally filtered product list from the context
  const { filteredProducts } = useAuth();

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>
      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default ProductsPage;