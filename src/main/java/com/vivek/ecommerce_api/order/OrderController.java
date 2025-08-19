package com.vivek.ecommerce_api.order;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @PostMapping
    public ResponseEntity<String> placeOrder(@AuthenticationPrincipal UserDetails userDetails) {
        Order newOrder = orderService.placeOrder(userDetails.getUsername());
        return new ResponseEntity<>("Order placed successfully with ID: " + newOrder.getId(), HttpStatus.CREATED);
    }
}