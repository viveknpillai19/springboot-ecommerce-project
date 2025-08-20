package com.vivek.ecommerce_api.product;

import com.vivek.ecommerce_api.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "categories")
public class Category extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;

    public Category() {
    }

    // 2. Constructor to easily create a new category with a name
    public Category(String name) {
        this.name = name;
    }
}
