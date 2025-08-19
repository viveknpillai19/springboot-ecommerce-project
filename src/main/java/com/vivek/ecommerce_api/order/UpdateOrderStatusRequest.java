package com.vivek.ecommerce_api.order;

import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
}
