package com.example.health_insurance_claim_management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // Authentication
                .requestMatchers("/api/auth/**")
                    .permitAll()

                // Customer - Own Policies
                .requestMatchers("/api/policies/my-policies")
                    .hasRole("CUSTOMER")

                // Admin/Agent - Policy Management
                .requestMatchers("/api/policies/**")
                    .hasAnyRole("ADMIN", "AGENT")

                // Customer - Update own profile
                .requestMatchers(HttpMethod.PUT, "/api/customers/me")
                    .hasRole("CUSTOMER")

                // Customer - View own profile
                .requestMatchers("/api/customers/me")
                    .hasRole("CUSTOMER")

                // Admin/Agent - Other Customer Management
                .requestMatchers("/api/customers/**")
                    .hasAnyRole("ADMIN", "AGENT")

                // Customer - Submit Claim
                .requestMatchers(HttpMethod.POST, "/api/claims")
                    .hasRole("CUSTOMER")

                // Customer - View Own Claims
                .requestMatchers("/api/claims/my-claims")
                    .hasRole("CUSTOMER")

                // Only Admin can manually approve claims
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/claims/*/approve")
                    .hasRole("ADMIN")

                // Only Admin can manually reject claims
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/claims/*/reject")
                    .hasRole("ADMIN")

                // Admin/Agent - Automatic Claim Processing
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/claims/*/process")
                    .hasAnyRole("ADMIN", "AGENT")

                // Admin/Agent - Other Claim Management
                .requestMatchers("/api/claims/**")
                    .hasAnyRole("ADMIN", "AGENT")

                // Admin - Dashboard
                .requestMatchers("/api/dashboard/**")
                    .hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest()
                    .authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}