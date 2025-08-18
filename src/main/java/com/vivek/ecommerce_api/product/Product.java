package com.vivek.ecommerce_api.product;

import com.vivek.ecommerce_api.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 1000) // Allow for a longer description.
    private String description;

    @Column(nullable = false)
    private BigDecimal price; // Use BigDecimal for currency to avoid floating-point errors.

    @Column(nullable = false)
    private Integer stock;

    private String imageUrl; // URL to the product image.


    // A Product belongs to one Category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // A Product belongs to one Brand
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;
}