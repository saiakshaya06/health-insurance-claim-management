
package com.example.health_insurance_claim_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.health_insurance_claim_management.model.Claim;

public interface ClaimRepository
        extends JpaRepository<Claim, Long> {

    List<Claim> findByStatus(String status);

    long countByStatus(String status);

    // Find all claims belonging to a particular customer
    // through the policy relationship
    List<Claim> findByPolicyCustomerId(Long customerId);
}

