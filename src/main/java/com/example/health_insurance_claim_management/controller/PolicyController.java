
package com.example.health_insurance_claim_management.controller;

import java.util.List;

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

import com.example.health_insurance_claim_management.model.Policy;
import com.example.health_insurance_claim_management.service.PolicyService;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    // Create Policy
    @PostMapping
    public ResponseEntity<Policy> createPolicy(
            @RequestBody Policy policy) {

        Policy savedPolicy =
                policyService.createPolicy(policy);

        return new ResponseEntity<>(
                savedPolicy,
                HttpStatus.CREATED
        );
    }

    // Get All Policies
    @GetMapping
    public ResponseEntity<List<Policy>> getAllPolicies() {

        List<Policy> policies =
                policyService.getAllPolicy();

        return ResponseEntity.ok(policies);
    }

    // Get My Policies
    @GetMapping("/my-policies")
    public ResponseEntity<List<Policy>> getMyPolicies(
            Authentication authentication) {

        String username =
                authentication.getName();

        List<Policy> policies =
                policyService.getMyPolicies(username);

        return ResponseEntity.ok(policies);
    }

    // Get Policy By ID
    @GetMapping("/{id}")
    public ResponseEntity<Policy> getPolicyById(
            @PathVariable Long id) {

        return policyService.getById(id)
                .map(policy ->
                        ResponseEntity.ok(policy)
                )
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // Update Policy
    @PutMapping("/{id}")
    public ResponseEntity<Policy> updatePolicy(
            @PathVariable Long id,
            @RequestBody Policy policy) {

        Policy updatedPolicy =
                policyService.updatePolicy(
                        id,
                        policy
                );

        return ResponseEntity.ok(updatedPolicy);
    }

    // Delete Policy
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(
            @PathVariable Long id) {

        policyService.deletePolicy(id);

        return ResponseEntity.noContent().build();
    }
}

