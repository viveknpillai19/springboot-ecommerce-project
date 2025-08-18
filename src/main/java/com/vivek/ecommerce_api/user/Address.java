package com.vivek.ecommerce_api.user;

import com.vivek.ecommerce_api.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "addresses")
public class Address extends BaseEntity {

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    private String country;

    // An Address belongs to one User.
    // FetchType.LAZY: Don't load the User object unless we explicitly ask for it. This is a performance optimization.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}