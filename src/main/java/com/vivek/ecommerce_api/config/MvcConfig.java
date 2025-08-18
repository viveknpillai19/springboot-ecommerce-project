package com.vivek.ecommerce_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Exposes the 'uploads' directory to be accessible via the '/uploads/**' URL path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}// In package: com.yourname.ecommerceapi.config
