package com.vivek.ecommerce_api.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    // All standard CRUD methods (save, findById, findAll, deleteById)
    // are automatically provided by JpaRepository.
}
