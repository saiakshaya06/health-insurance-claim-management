
package com.example.health_insurance_claim_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.health_insurance_claim_management.model.Customer;
import com.example.health_insurance_claim_management.model.Policy;
import com.example.health_insurance_claim_management.repository.CustomerRepository;
import com.example.health_insurance_claim_management.repository.PolicyRepository;

@Service
public class PolicyService {

    private final PolicyRepository repository;
    private final CustomerRepository customerRepository;

    public PolicyService(
            PolicyRepository repository,
            CustomerRepository customerRepository) {

        this.repository = repository;
        this.customerRepository = customerRepository;
    }

    // Create Policy
    public Policy createPolicy(Policy policy) {

        return repository.save(policy);
    }

    // Get All Policies
    public List<Policy> getAllPolicy() {

        return repository.findAll();
    }

    // Get Policy By ID
    public Optional<Policy> getById(Long id) {

        return repository.findById(id);
    }

    // Update Policy
    public Policy updatePolicy(
            Long id,
            Policy policy) {

        Policy existingPolicy =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Policy not found with id: "
                                                + id
                                )
                        );

        existingPolicy.setPolicyNumber(
                policy.getPolicyNumber()
        );

        existingPolicy.setPolicyType(
                policy.getPolicyType()
        );

        existingPolicy.setPremiumAmount(
                policy.getPremiumAmount()
        );

        existingPolicy.setCoverageAmount(
                policy.getCoverageAmount()
        );

        existingPolicy.setStartDate(
                policy.getStartDate()
        );

        existingPolicy.setEndDate(
                policy.getEndDate()
        );

        existingPolicy.setStatus(
                policy.getStatus()
        );

        existingPolicy.setCustomer(
                policy.getCustomer()
        );

        return repository.save(existingPolicy);
    }

    // Delete Policy
    public void deletePolicy(Long id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "Policy not found with id: " + id
            );
        }

        repository.deleteById(id);
    }

    // Get Policies of Logged-in Customer
    public List<Policy> getMyPolicies(
            String username) {

        Customer customer =
                customerRepository
                        .findByUserUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer profile not found."
                                )
                        );

        return repository.findByCustomerId(
                customer.getId()
        );
    }
}
