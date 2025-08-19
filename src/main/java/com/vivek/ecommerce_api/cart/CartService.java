package com.vivek.ecommerce_api.cart;

import com.vivek.ecommerce_api.product.Product;
import com.vivek.ecommerce_api.product.ProductRepository;
import com.vivek.ecommerce_api.user.User;
import com.vivek.ecommerce_api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public CartResponse getCartForUser(String email) {
        Cart cart = findOrCreateCart(email);
        return CartResponse.fromCart(cart);
    }

    @Transactional
    public CartResponse addProductToCart(String email, AddItemRequest request) {
        Cart cart = findOrCreateCart(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getQuantity() > product.getStock()) {
            throw new RuntimeException("Requested quantity exceeds available stock.");
        }

        // Check if the item is already in the cart
        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .ifPresentOrElse(
                        // If present, update quantity
                        item -> item.setQuantity(item.getQuantity() + request.getQuantity()),
                        // If not present, add new item
                        () -> {
                            CartItem newItem = new CartItem();
                            newItem.setCart(cart);
                            newItem.setProduct(product);
                            newItem.setQuantity(request.getQuantity());
                            cart.getItems().add(newItem);
                        }
                );

        return CartResponse.fromCart(cart);
    }

    @Transactional
    public CartResponse removeProductFromCart(String email, Long productId) {
        Cart cart = findOrCreateCart(email);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return CartResponse.fromCart(cart);
    }

    private Cart findOrCreateCart(String email) {
        return cartRepository.findByUserEmail(email)
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }
}