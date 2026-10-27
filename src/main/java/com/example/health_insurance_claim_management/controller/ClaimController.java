package com.example.health_insurance_claim_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.health_insurance_claim_management.model.Claim;
import com.example.health_insurance_claim_management.service.ClaimService;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    // Create Claim
    @PostMapping
    public ResponseEntity<Claim> createClaim(
            @RequestBody Claim claim,
            Authentication authentication) {

        String username = authentication.getName();

        Claim savedClaim =
                claimService.createClaim(claim, username);

        return new ResponseEntity<>(
                savedClaim,
                HttpStatus.CREATED
        );
    }

    // Get All Claims
    @GetMapping
    public ResponseEntity<List<Claim>> getAllClaims() {

        return ResponseEntity.ok(
                claimService.getAllClaims()
        );
    }

    // Get My Claims
    @GetMapping("/my-claims")
    public ResponseEntity<List<Claim>> getMyClaims(
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                claimService.getMyClaims(username)
        );
    }

    // Get Claims by Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Claim>> getClaimsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                claimService.getClaimsByStatus(status)
        );
    }

    // Get Claim Count by Status
    @GetMapping("/count/{status}")
    public ResponseEntity<Long> getClaimCountByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                claimService.getClaimCountByStatus(status)
        );
    }

    // Get Claim Summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getClaimSummary() {

        return ResponseEntity.ok(
                claimService.getClaimSummary()
        );
    }

    // Get Claim by ID
    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaimById(
            @PathVariable Long id) {

        return claimService.getClaimById(id)
                .map(claim -> ResponseEntity.ok(claim))
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // Update Claim
    @PutMapping("/{id}")
    public ResponseEntity<Claim> updateClaim(
            @PathVariable Long id,
            @RequestBody Claim claim) {

        return ResponseEntity.ok(
                claimService.updateClaim(id, claim)
        );
    }

    // Automatic processing
    @PutMapping("/{id}/process")
    public ResponseEntity<Claim> processClaim(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                claimService.processClaim(id)
        );
    }

    // Manual approval
    @PutMapping("/{id}/approve")
    public ResponseEntity<Claim> approveClaim(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                claimService.approveClaim(id)
        );
    }

    // Manual rejection
    @PutMapping("/{id}/reject")
    public ResponseEntity<Claim> rejectClaim(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String reason = request.get("reason");

        return ResponseEntity.ok(
                claimService.rejectClaim(id, reason)
        );
    }

    // Delete Claim
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(
            @PathVariable Long id) {

        claimService.deleteClaim(id);

        return ResponseEntity.noContent().build();
    }
}
