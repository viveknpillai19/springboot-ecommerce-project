package com.vivek.ecommerce_api.product;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173") // Or use your global CORS config
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        // Simple validation to prevent categories with the same name
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409 Conflict
        }
        Category savedCategory = categoryRepository.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
}