package com.vivek.ecommerce_api.cart;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCartForUser(userDetails.getUsername()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestBody AddItemRequest request) {
        return ResponseEntity.ok(cartService.addProductToCart(userDetails.getUsername(), request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeItemFromCart(@AuthenticationPrincipal UserDetails userDetails,
                                                           @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProductFromCart(userDetails.getUsername(), productId));
    }
}
