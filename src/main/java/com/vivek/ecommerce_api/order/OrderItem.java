package com.vivek.ecommerce_api.order;

import com.vivek.ecommerce_api.common.BaseEntity;
import com.vivek.ecommerce_api.product.Product;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    // We store the price here to capture the price at the time of purchase.
    // This is important because the product's price might change in the future.
    @Column(nullable = false)
    private BigDecimal price;
}
