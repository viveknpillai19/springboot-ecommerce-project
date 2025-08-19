package com.vivek.ecommerce_api.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
// This annotation ensures a completely clean slate after each test method.
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BrandRepository brandRepository;

    private Category category1;
    private Brand brand1;

    // In ProductControllerTest.java

    @BeforeEach
    void setUp() {
        // ... cleanup code ...
        productRepository.deleteAllInBatch();
        categoryRepository.deleteAllInBatch();
        brandRepository.deleteAllInBatch();

        // ... setup for category1, brand1, and product1 ...
        category1 = new Category();
        category1.setName("Electronics");
        categoryRepository.save(category1);

        Category category2 = new Category();
        category2.setName("Books");
        categoryRepository.save(category2);

        brand1 = new Brand();
        brand1.setName("Sony");
        brandRepository.save(brand1);

        Product product1 = new Product();
        product1.setName("Sony Wireless Headphones");
        product1.setPrice(new BigDecimal("199.99"));
        product1.setStock(10);
        product1.setCategory(category1);
        product1.setBrand(brand1);
        productRepository.save(product1);

        // --- FIX IS HERE ---
        Product product2 = new Product();
        product2.setName("Java Programming Guide");
        product2.setPrice(new BigDecimal("49.99"));
        product2.setStock(20);
        product2.setCategory(category2);
        product2.setBrand(brand1); // Assign a brand to product2
        productRepository.save(product2);
    }

    @Test
    void testGetProducts_NoFilter_ReturnsAll() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void testGetProducts_FilterByCategory_ReturnsOne() throws Exception {
        mockMvc.perform(get("/api/products").param("categoryId", category1.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Sony Wireless Headphones"));
    }

    @Test
    void testGetProducts_FilterByPriceRange_ReturnsOne() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("minPrice", "150.00")
                        .param("maxPrice", "250.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Sony Wireless Headphones"));
    }

    @Test
    void testGetProducts_FilterByName_ReturnsOne() throws Exception {
        mockMvc.perform(get("/api/products").param("name", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Java Programming Guide"));
    }
}