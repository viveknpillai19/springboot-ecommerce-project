package com.vivek.ecommerce_api.user;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
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
