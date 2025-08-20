// src/components/ProductCard.jsx
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const { token, addToCart } = useAuth();

  const handleAddToCart = () => {
    addToCart(product.id, 1); // Add 1 quantity
  };

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">{product.description}</Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>${product.price}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ marginTop: 'auto' }}>
        <Button size="small" color="primary" disabled={!token} onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;