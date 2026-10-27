
package com.example.health_insurance_claim_management.security;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Secret key used to create and verify JWT tokens
    private static final String SECRET_KEY =
            "HealthInsuranceClaimManagementSecretKey2026Secure";

    // Token validity: 24 hours
    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    // Create signing key
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    // Generate JWT token
    public String generateToken(String username, String role) {

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }

    // Extract username from JWT
    public String extractUsername(String token) {

        return getClaims(token).getSubject();
    }

    // Extract role from JWT
    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }

    // Get claims from JWT
    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Validate JWT
    public boolean isTokenValid(
            String token,
            String username) {

        String extractedUsername =
                extractUsername(token);

        return extractedUsername.equals(username)
                && !isTokenExpired(token);
    }

    // Check whether token is expired
    private boolean isTokenExpired(String token) {

        Date expiration =
                getClaims(token).getExpiration();

        return expiration.before(new Date());
    }
}
