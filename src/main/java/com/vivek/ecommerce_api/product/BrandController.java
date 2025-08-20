package com.vivek.ecommerce_api.product;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:5173") // Or use your global CORS config
public class BrandController {

    private final BrandRepository brandRepository;

    public BrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        // Check if a brand with the same name already exists to prevent duplicates
        if (brandRepository.findByName(brand.getName()).isPresent()) {
            // If it exists, return a 409 Conflict status to the client
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        // If the name is unique, save the new brand
        Brand savedBrand = brandRepository.save(brand);

        // Return the newly created brand with a 201 Created status
        return new ResponseEntity<>(savedBrand, HttpStatus.CREATED);
    }
}