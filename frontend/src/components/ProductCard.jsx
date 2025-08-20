// src/components/ProductCard.jsx
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const { token, addToCart } = useAuth();

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  return (
    // Make the Card a flex container that fills the height of its parent
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="140"
          image={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">{product.description}</Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>${product.price.toFixed(2)}</Typography>
        </CardContent>
      </CardActionArea>
      {/* This ensures the button always sticks to the bottom of the card */}
      <CardActions sx={{ marginTop: 'auto' }}>
        <Button size="small" color="primary" disabled={!token} onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;