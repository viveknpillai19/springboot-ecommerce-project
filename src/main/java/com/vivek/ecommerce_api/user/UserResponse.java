package com.vivek.ecommerce_api.user;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean isActive;

    // A static factory method to convert a User entity to a UserResponse DTO
    public static UserResponse fromUser(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        return dto;
    }
}
