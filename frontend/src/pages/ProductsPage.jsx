import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/apiClient';
import ProductCard from '../components/ProductCard';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function ProductsPage() {
  const [products, setProducts] = useState([]);

  // useEffect runs this code when the component first loads
  useEffect(() => {
    // We define an async function inside so we can use await
    const getProducts = async () => {
      const productsData = await fetchProducts();
      setProducts(productsData);
    };

    getProducts();
  }, []); // The empty array means this effect runs only once

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default ProductsPage;