package com.vivek.ecommerce_api.admin;

import com.vivek.ecommerce_api.product.Brand;
import com.vivek.ecommerce_api.product.BrandRepository;
import com.vivek.ecommerce_api.product.Category;
import com.vivek.ecommerce_api.product.CategoryRepository;
import com.vivek.ecommerce_api.user.Role;
import com.vivek.ecommerce_api.user.User;
import com.vivek.ecommerce_api.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        categoryRepository.deleteAll();
        brandRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN") // Simulate a logged-in user with the ADMIN role
    void testGetAllUsers_AsAdmin_Success() throws Exception {
        // Arrange
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);

        // Act & Assert
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("test@example.com"));
    }

    @Test
    @WithMockUser(roles = "USER") // Simulate a logged-in user with the USER role
    void testGetAllUsers_AsUser_Fails() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetAllUsers_AsAnonymous_Fails() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isUnauthorized()); // Fails because no user is logged in
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateProduct_AsAdmin_Success() throws Exception {
        // Arrange: Create necessary category and brand
        Category category = new Category();
        category.setName("Electronics");
        categoryRepository.save(category);

        Brand brand = new Brand();
        brand.setName("TestBrand");
        brandRepository.save(brand);

        MockMultipartFile imageFile = new MockMultipartFile(
                "image", "test-image.jpg", MediaType.IMAGE_JPEG_VALUE, "test image content".getBytes()
        );

        String productJson = String.format(
                "{\"name\":\"Test Product\",\"description\":\"A cool product\",\"price\":99.99,\"stock\":10,\"categoryId\":%d,\"brandId\":%d}",
                category.getId(), brand.getId()
        );

        MockMultipartFile productPart = new MockMultipartFile(
                "product", "", MediaType.APPLICATION_JSON_VALUE, productJson.getBytes()
        );

        // Act & Assert
        mockMvc.perform(multipart("/api/admin/products").file(imageFile).file(productPart))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Product"));
    }
}