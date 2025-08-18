package com.vivek.ecommerce_api.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // By extending JpaRepository, we get a lot of methods for free, including:
    // - save()
    // - findById()
    // - findAll()
    // - deleteById()
    // - existsById()
    //
    // We can add custom query methods here later for filtering and searching.
}
