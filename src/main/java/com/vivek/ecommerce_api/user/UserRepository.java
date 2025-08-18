package com.vivek.ecommerce_api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Marks this as a Spring Data repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their email address.
     * Spring Data JPA automatically creates the query for this method
     * based on the method name "findByEmail".
     *
     * @param email The email address to search for.
     * @return An Optional containing the User if found, or an empty Optional otherwise.
     */
    Optional<User> findByEmail(String email);
}
