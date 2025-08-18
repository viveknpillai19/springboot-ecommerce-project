package com.vivek.ecommerce_api.auth;

import com.vivek.ecommerce_api.user.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // Optional: Allow specifying role on registration
}
