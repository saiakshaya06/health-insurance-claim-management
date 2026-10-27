
package com.example.health_insurance_claim_management.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Get Authorization header
        String authorizationHeader =
                request.getHeader("Authorization");

        // Check whether token is present
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token =
                authorizationHeader.substring(7);

        try {

            // Extract username from token
            String username =
                    jwtService.extractUsername(token);

            // Extract role from token
            String role =
                    jwtService.extractRole(token);

            // Check whether user is not already authenticated
            if (username != null
                    && SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                // Validate token
                if (jwtService.isTokenValid(
                        token,
                        username)) {

                    // Create authority using role
                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            );

                    // Create authentication object
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    java.util.List.of(authority)
                            );

                    // Store authentication in SecurityContext
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            // Invalid token
            SecurityContextHolder
                    .clearContext();
        }

        // Continue request
        filterChain.doFilter(request, response);
    }
}
