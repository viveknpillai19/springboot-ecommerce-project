package com.vivek.ecommerce_api.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser) // Convert each User to UserResponse DTO
                .collect(Collectors.toList());
    }

    // In UserService.java

    public UserResponse getUserProfile(String email) {
        // 1. Find the user in the database by their unique email.
        User user = userRepository.findByEmail(email)
                // 2. If the user is not found, throw an exception.
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        // 3. Convert the User entity to a safe UserResponse DTO and return it.
        return UserResponse.fromUser(user);
    }
    // In UserService.java

    @Transactional
    public UserResponse updateUserProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getAddresses() != null) {
            // --- This entire section is the corrected logic ---
            Map<Long, Address> existingAddresses = user.getAddresses().stream()
                    .collect(Collectors.toMap(Address::getId, address -> address));
            Set<Long> requestAddressIds = request.getAddresses().stream()
                    .map(AddressDTO::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            for (AddressDTO dto : request.getAddresses()) {
                if (dto.getId() != null) {
                    // Update existing address
                    Address addressToUpdate = existingAddresses.get(dto.getId());
                    if (addressToUpdate != null) {
                        addressToUpdate.setStreet(dto.getStreet());
                        addressToUpdate.setCity(dto.getCity());
                        addressToUpdate.setState(dto.getState());
                        addressToUpdate.setPostalCode(dto.getPostalCode());
                        addressToUpdate.setCountry(dto.getCountry());
                    }
                } else {
                    // Add new address - THIS IS THE CORRECTED PART
                    Address newAddress = new Address();
                    newAddress.setStreet(dto.getStreet());
                    newAddress.setCity(dto.getCity());
                    newAddress.setState(dto.getState());
                    newAddress.setPostalCode(dto.getPostalCode());
                    newAddress.setCountry(dto.getCountry()); // Ensure all fields are set
                    user.addAddress(newAddress);
                }
            }

            // Remove addresses that were in the DB but not in the request
            List<Address> addressesToRemove = user.getAddresses().stream()
                    .filter(address -> address.getId() != null && !requestAddressIds.contains(address.getId()))
                    .toList();
            user.getAddresses().removeAll(addressesToRemove);
        }

        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }

    @Transactional // Ensures the operation is a single database transaction
    public UserResponse banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        user.setActive(false);
        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }

    @Transactional
    public UserResponse unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        user.setActive(true);
        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }
}
