package com.vivek.ecommerce_api.user;

import lombok.Data;
import java.util.List;

// This DTO defines what a user can update in their profile
@Data
public class UpdateProfileRequest {
    private String name;
    private List<AddressDTO> addresses; // Allows adding/updating addresses
}