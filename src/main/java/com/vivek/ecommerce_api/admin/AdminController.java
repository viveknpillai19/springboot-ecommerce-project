// In package: com.vivek.ecommerce_api.admin
package com.vivek.ecommerce_api.admin;

import com.vivek.ecommerce_api.order.OrderResponse;
import com.vivek.ecommerce_api.order.OrderService;
import com.vivek.ecommerce_api.order.UpdateOrderStatusRequest;
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
    private final ProductService productService;
    private final OrderService orderService;

    public AdminController(UserService userService, ProductService productService, OrderService orderService) {
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
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
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
                                                           @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request.getStatus()));
    }
}