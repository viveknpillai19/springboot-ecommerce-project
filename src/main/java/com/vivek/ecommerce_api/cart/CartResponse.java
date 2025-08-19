package com.vivek.ecommerce_api.cart;

import com.vivek.ecommerce_api.product.Product;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CartResponse {
    private Long id;
    private List<CartItemDTO> items;
    private BigDecimal totalPrice;

    // DTO for individual cart items
    @Data
    public static class CartItemDTO {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }

    // Factory method to convert a Cart entity to a CartResponse DTO
    public static CartResponse fromCart(Cart cart) {
        CartResponse dto = new CartResponse();
        dto.setId(cart.getId());

        dto.setItems(cart.getItems().stream().map(cartItem -> {
            CartItemDTO itemDTO = new CartItemDTO();
            Product product = cartItem.getProduct();
            itemDTO.setProductId(product.getId());
            itemDTO.setProductName(product.getName());
            itemDTO.setQuantity(cartItem.getQuantity());
            itemDTO.setPrice(product.getPrice());
            return itemDTO;
        }).collect(Collectors.toList()));

        // Calculate total price
        dto.setTotalPrice(cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return dto;
    }
}