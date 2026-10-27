
package com.example.health_insurance_claim_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.health_insurance_claim_management.model.Policy;

public interface PolicyRepository
        extends JpaRepository<Policy, Long> {

    List<Policy> findByCustomerId(Long customerId);
}
