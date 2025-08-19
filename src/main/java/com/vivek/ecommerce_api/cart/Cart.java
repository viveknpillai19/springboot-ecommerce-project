package com.vivek.ecommerce_api.cart;

import com.vivek.ecommerce_api.common.BaseEntity;
import com.vivek.ecommerce_api.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "carts")
public class Cart extends BaseEntity {

    // A cart has a one-to-one relationship with a user
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // A cart can have many items
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CartItem> items = new ArrayList<>();
}
