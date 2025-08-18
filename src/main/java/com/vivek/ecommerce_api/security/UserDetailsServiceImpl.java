// In package: com.vivek.ecommerce_api.security
package com.vivek.ecommerce_api.security;

import com.vivek.ecommerce_api.user.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.vivek.ecommerce_api.user.User appUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (!appUser.isActive()) {
            throw new UsernameNotFoundException("User account is locked.");
        }

        // Create a list containing the user's role
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(appUser.getRole().name())
        );

        // Return the UserDetails object with the correct authorities
        return new org.springframework.security.core.userdetails.User(
                appUser.getEmail(),
                appUser.getPassword(),
                authorities
        );
    }
}