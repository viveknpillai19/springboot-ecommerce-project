package com.vivek.ecommerce_api.product;

import com.vivek.ecommerce_api.storage.FileStorageService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private ProductRepository productRepository; // ✅ FIXED

    @InjectMocks
    private ProductService productService;

    public ProductServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProduct_Success() {
        // Mock request
        ProductRequest request = new ProductRequest();
        request.setName("Laptop");
        request.setDescription("Gaming Laptop");
        request.setPrice(BigDecimal.valueOf(1200.0));
        request.setCategoryId(1L);
        request.setBrandId(1L);

        MockMultipartFile imageFile =
                new MockMultipartFile("file", "test.png", "image/png", "dummy".getBytes());

        // Mock category & brand
        Category category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        Brand brand = new Brand();
        brand.setId(1L);
        brand.setName("Dell");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));
        when(fileStorageService.store(any())).thenReturn("unique-filename.png");

        // Mock URI builder
        ServletUriComponentsBuilder mockBuilder = mock(ServletUriComponentsBuilder.class);
        when(mockBuilder.path(anyString())).thenReturn(mockBuilder);
        when(mockBuilder.toUriString()).thenReturn("http://localhost/images/unique-filename.png");

        // Mock Product save
        Product savedProduct = new Product();
        savedProduct.setId(100L);
        savedProduct.setName("Laptop");
        savedProduct.setDescription("Gaming Laptop");
        savedProduct.setPrice(BigDecimal.valueOf(1200.0));
        savedProduct.setCategory(category);
        savedProduct.setBrand(brand);
        savedProduct.setImageUrl("http://localhost/images/unique-filename.png");

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct); // ✅ FIXED

        try (MockedStatic<ServletUriComponentsBuilder> mocked =
                     mockStatic(ServletUriComponentsBuilder.class)) {

            mocked.when(ServletUriComponentsBuilder::fromCurrentContextPath)
                    .thenReturn(mockBuilder);

            // Act
            ProductResponse response = productService.createProduct(request, imageFile);

            // Assert
            assertNotNull(response);
            assertEquals("Laptop", response.getName());
            assertEquals("http://localhost/images/unique-filename.png", response.getImageUrl());
            verify(fileStorageService, times(1)).store(any());
            verify(productRepository, times(1)).save(any(Product.class)); // ✅ extra validation
        }
    }
}
