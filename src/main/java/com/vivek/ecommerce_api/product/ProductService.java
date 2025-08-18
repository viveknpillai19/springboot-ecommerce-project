package com.vivek.ecommerce_api.product;

import com.vivek.ecommerce_api.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final FileStorageService fileStorageService;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
                          BrandRepository brandRepository, FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.fileStorageService = fileStorageService;
    }

    // Public method to get all products
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::fromProduct)
                .collect(Collectors.toList());
    }

    // Admin method to create a product
    @Transactional
    public ProductResponse createProduct(ProductRequest request, MultipartFile image) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);
        product.setBrand(brand);

        if (image != null && !image.isEmpty()) {
            String filename = fileStorageService.store(image);
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(filename)
                    .toUriString();
            product.setImageUrl(imageUrl);
        }

        Product savedProduct = productRepository.save(product);
        return ProductResponse.fromProduct(savedProduct);
    }

    // Admin method to delete a product
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(productId);
    }

    // ... other methods for updating, etc. can be added here
}