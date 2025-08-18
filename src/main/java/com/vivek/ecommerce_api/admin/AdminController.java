// In package: com.vivek.ecommerce_api.admin
package com.vivek.ecommerce_api.admin;

import com.vivek.ecommerce_api.product.ProductRequest;
import com.vivek.ecommerce_api.product.ProductResponse;
import com.vivek.ecommerce_api.product.ProductService;
import com.vivek.ecommerce_api.user.UserResponse;
import com.vivek.ecommerce_api.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final ProductService productService; // Inject ProductService

    public AdminController(UserService userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }


    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<UserResponse> banUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.banUser(userId));
    }

    @PutMapping("/users/{userId}/unban")
    public ResponseEntity<UserResponse> unbanUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.unbanUser(userId));
    }
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(@RequestPart("product") ProductRequest productRequest,
                                                         @RequestPart("image") MultipartFile image) {
        ProductResponse createdProduct = productService.createProduct(productRequest, image);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}