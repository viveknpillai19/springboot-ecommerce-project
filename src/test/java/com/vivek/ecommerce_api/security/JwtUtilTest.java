package com.vivek.ecommerce_api.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Use ReflectionTestUtils to set the secret key in our test
        ReflectionTestUtils.setField(jwtUtil, "secretKey", "averylongandsecurekeythatisatleastsixteenbyteslongandhardtoguess");
    }

    @Test
    void testGenerateTokenAndValidate() {
        String username = "test@example.com";
        String token = jwtUtil.generateToken(username);

        assertNotNull(token);
        assertEquals(username, jwtUtil.extractUsername(token));

        UserDetails userDetails = new User(username, "password", new ArrayList<>());
        assertTrue(jwtUtil.isTokenValid(token, userDetails));
    }
}