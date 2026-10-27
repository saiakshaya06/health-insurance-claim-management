
package com.example.health_insurance_claim_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.health_insurance_claim_management.model.Customer;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUserUsername(String username);
}

