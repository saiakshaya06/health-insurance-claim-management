
package com.example.health_insurance_claim_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.health_insurance_claim_management.dto.LoginRequest;
import com.example.health_insurance_claim_management.dto.LoginResponse;
import com.example.health_insurance_claim_management.dto.RegisterRequest;
import com.example.health_insurance_claim_management.model.User;
import com.example.health_insurance_claim_management.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/customer")
    public ResponseEntity<User> registerCustomer(
            @Valid @RequestBody RegisterRequest request) {

        User user =
                authService.register(
                        request,
                        "CUSTOMER");

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register/agent")
    public ResponseEntity<User> registerAgent(
            @Valid @RequestBody RegisterRequest request) {

        User user =
                authService.register(
                        request,
                        "AGENT");

        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }
}

