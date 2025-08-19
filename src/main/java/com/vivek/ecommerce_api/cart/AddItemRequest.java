package com.vivek.ecommerce_api.cart;

import lombok.Data;

@Data
public class AddItemRequest {
    private Long productId;
    private Integer quantity;
}
