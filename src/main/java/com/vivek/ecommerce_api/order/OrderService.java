package com.vivek.ecommerce_api.order;


import com.vivek.ecommerce_api.cart.Cart;
import com.vivek.ecommerce_api.cart.CartRepository;
import com.vivek.ecommerce_api.exception.ResourceNotFoundException;
import com.vivek.ecommerce_api.product.Product;
import com.vivek.ecommerce_api.user.Address;
import com.vivek.ecommerce_api.user.User;
import com.vivek.ecommerce_api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    @Transactional
    public Order placeOrder(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Cart cart = cartRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + email));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot place an order with an empty cart.");
        }

        Address shippingAddress = user.getAddresses().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No shipping address found. Please add an address to your profile."));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PROCESSING);
        order.setItems(new ArrayList<>());

        // Copy shipping address details to the order
        order.setShippingStreet(shippingAddress.getStreet());
        order.setShippingCity(shippingAddress.getCity());
        order.setShippingState(shippingAddress.getState());
        order.setShippingPostalCode(shippingAddress.getPostalCode());
        order.setShippingCountry(shippingAddress.getCountry());

        BigDecimal totalPrice = BigDecimal.ZERO;

        // Process each cart item
        for (var cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // 1. Validate stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName());
            }

            // 2. Decrement stock
            product.setStock(product.getStock() - cartItem.getQuantity());

            // 3. Create OrderItem and link it to the Order
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice()); // Capture current price
            order.getItems().add(orderItem);

            totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotalPrice(totalPrice);

        // 4. Clear the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // 5. Save the order
        return orderRepository.save(order);
    }
    public List<OrderResponse> getOrdersForUser(String email) {
        return orderRepository.findAllByUserEmail(email).stream()
                .map(OrderResponse::fromOrder)
                .collect(Collectors.toList());
    }

    // Method for an admin to get all orders
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderResponse::fromOrder)
                .collect(Collectors.toList());
    }
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return OrderResponse.fromOrder(updatedOrder);
    }

    // Method for a user to cancel their own order
    @Transactional
    public OrderResponse cancelOrder(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // Security check: ensure the user owns this order
        if (!order.getUser().getEmail().equals(email)) {
            throw new IllegalStateException("You are not authorized to cancel this order.");
        }

        // Business logic check: ensure the order is in a cancelable state
        if (order.getStatus() != OrderStatus.PROCESSING) {
            throw new IllegalStateException("Order cannot be cancelled as it is already " + order.getStatus());
        }

        // Restore the stock for each item in the order
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            // No need to save the product here, JPA's transactional context will handle it
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        return OrderResponse.fromOrder(updatedOrder);
    }
}
