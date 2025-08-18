package com.vivek.ecommerce_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Marks this class as a source of bean definitions
public class AppConfig {

    @Bean // This method produces a bean to be managed by the Spring container
    public PasswordEncoder passwordEncoder() {
        // Use BCrypt for strong, salted password hashing
        return new BCryptPasswordEncoder();
    }
}
