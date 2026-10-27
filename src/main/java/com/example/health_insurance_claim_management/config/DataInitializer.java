
package com.example.health_insurance_claim_management.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.health_insurance_claim_management.model.User;
import com.example.health_insurance_claim_management.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Check whether an Admin already exists
            boolean adminExists =
                    userRepository.findAll()
                            .stream()
                            .anyMatch(user ->
                                    "ADMIN".equalsIgnoreCase(
                                            user.getRole()
                                    )
                            );

            // Create Admin only if one does not exist
            if (!adminExists) {

                User admin = new User();

                admin.setUsername("admin");

                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                admin.setRole("ADMIN");

                admin.setActive(true);

                userRepository.save(admin);

                System.out.println(
                        "Default Admin account created successfully."
                );
            }
        };
    }
}
