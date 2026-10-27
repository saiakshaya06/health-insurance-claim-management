package com.example.health_insurance_claim_management.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.health_insurance_claim_management.dto.LoginRequest;
import com.example.health_insurance_claim_management.dto.LoginResponse;
import com.example.health_insurance_claim_management.dto.RegisterRequest;
import com.example.health_insurance_claim_management.model.Customer;
import com.example.health_insurance_claim_management.model.User;
import com.example.health_insurance_claim_management.repository.CustomerRepository;
import com.example.health_insurance_claim_management.repository.UserRepository;
import com.example.health_insurance_claim_management.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final CustomerRepository customerRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register Customer or Agent
    public User register(
            RegisterRequest request,
            String role) {

        // Check username
        if (userRepository
                .findByUsername(request.getUsername())
                .isPresent()) {

            throw new RuntimeException(
                    "Username already exists."
            );
        }

        // Create User
        User user = new User();

        user.setUsername(
                request.getUsername()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setEmail(
                request.getEmail()
        );

        user.setRole(
                role
        );

        user.setActive(true);

        // Save User first
        User savedUser =
                userRepository.save(user);

        // Create Customer profile
        if ("CUSTOMER".equalsIgnoreCase(role)) {

            Customer customer = new Customer();

            customer.setName(
                    request.getName()
            );

            customer.setEmail(
                    request.getEmail()
            );

            customer.setPhone(
                    request.getPhone()
            );

            customer.setDateOfBirth(
                    request.getDateOfBirth()
            );

            customer.setAddress(
                    request.getAddress()
            );

            // Automatically connect User and Customer
            customer.setUser(savedUser);

            customerRepository.save(customer);
        }

        return savedUser;
    }

    // Login
    public LoginResponse login(
            LoginRequest request) {

        User user =
                userRepository
                        .findByUsername(
                                request.getUsername()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid username or password."
                                )
                        );

        // Check whether account is active
        if (!user.isActive()) {

            throw new RuntimeException(
                    "User account is inactive."
            );
        }

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid username or password."
            );
        }

        // Generate JWT
        String token =
                jwtService.generateToken(
                        user.getUsername(),
                        user.getRole()
                );

        return new LoginResponse(
                "Login successful",
                token,
                user.getUsername(),
                user.getRole()
        );
    }
}

