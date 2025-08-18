package com.vivek.ecommerce_api.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Lombok constructor for all fields
public class AuthResponse {
    private String token;
    private String email;
}