package com.vivek.ecommerce_api.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // All standard CRUD methods (save, findById, findAll, deleteById)
    // are automatically provided by JpaRepository.
}
