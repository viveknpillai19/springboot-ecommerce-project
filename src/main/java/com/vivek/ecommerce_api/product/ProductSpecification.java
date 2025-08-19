package com.vivek.ecommerce_api.product;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class ProductSpecification {

    public Specification<Product> hasName(String name) {
        return (root, query, criteriaBuilder) ->
                name == null ? criteriaBuilder.conjunction() :
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public Specification<Product> inCategory(Long categoryId) {
        return (root, query, criteriaBuilder) ->
                categoryId == null ? criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    public Specification<Product> byBrand(Long brandId) {
        return (root, query, criteriaBuilder) ->
                brandId == null ? criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("brand").get("id"), brandId);
    }

    public Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice == null && maxPrice == null) {
            return (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
        }
        if (minPrice == null) {
            return (root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        }
        if (maxPrice == null) {
            return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        }
        return (root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
    }
}