package com.vivek.ecommerce_api.user;

import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean isActive;
    private List<AddressDTO> addresses; // Add this field

    // A static factory method to convert a User entity to a UserResponse DTO
    public static UserResponse fromUser(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());

        // Convert the list of Address entities to a list of AddressDTOs
        if (user.getAddresses() != null) {
            dto.setAddresses(user.getAddresses().stream()
                    .map(AddressDTO::fromAddress)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}