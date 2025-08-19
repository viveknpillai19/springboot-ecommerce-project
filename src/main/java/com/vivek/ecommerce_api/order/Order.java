package com.vivek.ecommerce_api.order;
import com.vivek.ecommerce_api.common.BaseEntity;
import com.vivek.ecommerce_api.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    // We store the shipping address details directly in the order
    // to preserve them, even if the user later deletes the address from their profile.
    @Column(nullable = false)
    private String shippingStreet;
    @Column(nullable = false)
    private String shippingCity;
    @Column(nullable = false)
    private String shippingState;
    @Column(nullable =false)
    private String shippingPostalCode;
    @Column(nullable = false)
    private String shippingCountry;
}
