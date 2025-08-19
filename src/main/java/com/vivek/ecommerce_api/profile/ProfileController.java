package com.vivek.ecommerce_api.profile;

import com.vivek.ecommerce_api.user.UpdateProfileRequest;
import com.vivek.ecommerce_api.user.UserResponse;
import com.vivek.ecommerce_api.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // @AuthenticationPrincipal injects the currently logged-in user's details
        String email = userDetails.getUsername();
        UserResponse userProfile = userService.getUserProfile(email);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateUserProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                          @RequestBody UpdateProfileRequest request) {
        String email = userDetails.getUsername();
        UserResponse updatedProfile = userService.updateUserProfile(email, request);
        return ResponseEntity.ok(updatedProfile);
    }
}