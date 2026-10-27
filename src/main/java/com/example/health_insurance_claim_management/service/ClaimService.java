package com.example.health_insurance_claim_management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.health_insurance_claim_management.model.Claim;
import com.example.health_insurance_claim_management.model.Customer;
import com.example.health_insurance_claim_management.model.Hospital;
import com.example.health_insurance_claim_management.model.Policy;
import com.example.health_insurance_claim_management.repository.ClaimRepository;
import com.example.health_insurance_claim_management.repository.CustomerRepository;
import com.example.health_insurance_claim_management.repository.HospitalRepository;
import com.example.health_insurance_claim_management.repository.PolicyRepository;

@Service
public class ClaimService {

    private final ClaimRepository repository;
    private final PolicyRepository policyRepository;
    private final HospitalRepository hospitalRepository;
    private final CustomerRepository customerRepository;

    public ClaimService(
            ClaimRepository repository,
            PolicyRepository policyRepository,
            HospitalRepository hospitalRepository,
            CustomerRepository customerRepository) {

        this.repository = repository;
        this.policyRepository = policyRepository;
        this.hospitalRepository = hospitalRepository;
        this.customerRepository = customerRepository;
    }

    // Create Claim
    public Claim createClaim(
            Claim claim,
            String username) {

        Customer customer =
                customerRepository
                        .findByUserUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer profile not found."));

        if (claim.getPolicyId() == null) {
            throw new RuntimeException(
                    "Policy is required to submit a claim.");
        }

        Policy policy =
                policyRepository
                        .findById(claim.getPolicyId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Policy not found with id: "
                                                + claim.getPolicyId()));

        if (policy.getCustomer() == null
                || !policy.getCustomer()
                        .getId()
                        .equals(customer.getId())) {

            throw new RuntimeException(
                    "You can submit a claim only for your own policy.");
        }

        if (!"ACTIVE".equalsIgnoreCase(policy.getStatus())) {
            throw new RuntimeException(
                    "You can submit a claim only for an active policy.");
        }

        if (claim.getClaimAmount() <= 0) {
            throw new RuntimeException(
                    "Claim amount must be greater than zero.");
        }

        if (claim.getClaimAmount() > policy.getCoverageAmount()) {
            throw new RuntimeException(
                    "Claim amount exceeds policy coverage.");
        }

        claim.setPolicy(policy);

        if (claim.getHospitalId() != null) {

            Hospital hospital =
                    hospitalRepository
                            .findById(claim.getHospitalId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Hospital not found with id: "
                                                    + claim.getHospitalId()));

            claim.setHospital(hospital);
        }

        claim.setStatus("PENDING");
        claim.setRejectionReason(null);

        return repository.save(claim);
    }

    // Get all claims
    public List<Claim> getAllClaims() {
        return repository.findAll();
    }

    // Get claims of logged-in customer
    public List<Claim> getMyClaims(String username) {

        Customer customer =
                customerRepository
                        .findByUserUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer profile not found."));

        return repository.findByPolicyCustomerId(
                customer.getId());
    }

    // Get claim by ID
    public Optional<Claim> getClaimById(Long id) {
        return repository.findById(id);
    }

    // Update Claim
    public Claim updateClaim(Long id, Claim claim) {

        Claim existingClaim =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Claim not found with id: " + id));

        existingClaim.setClaimNumber(claim.getClaimNumber());
        existingClaim.setClaimAmount(claim.getClaimAmount());
        existingClaim.setClaimDate(claim.getClaimDate());
        existingClaim.setDescription(claim.getDescription());
        existingClaim.setStatus(claim.getStatus());
        existingClaim.setRejectionReason(claim.getRejectionReason());

        if (claim.getPolicyId() != null) {

            Policy policy =
                    policyRepository
                            .findById(claim.getPolicyId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Policy not found with id: "
                                                    + claim.getPolicyId()));

            existingClaim.setPolicy(policy);
        }

        if (claim.getHospitalId() != null) {

            Hospital hospital =
                    hospitalRepository
                            .findById(claim.getHospitalId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Hospital not found with id: "
                                                    + claim.getHospitalId()));

            existingClaim.setHospital(hospital);
        }

        return repository.save(existingClaim);
    }

    // Delete Claim
    public void deleteClaim(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Claim not found with id: " + id);
        }

        repository.deleteById(id);
    }

    // Shared validation for claim decisions
    private void validateClaimForApproval(Claim claim) {

        Policy policy = claim.getPolicy();

        if (policy == null) {
            throw new RuntimeException(
                    "No policy is associated with this claim.");
        }

        if (!"ACTIVE".equalsIgnoreCase(policy.getStatus())) {
            throw new RuntimeException(
                    "Policy is not active. Claim cannot be approved.");
        }

        if (claim.getClaimAmount() <= 0) {
            throw new RuntimeException(
                    "Claim amount must be greater than zero.");
        }

        if (claim.getClaimAmount() > policy.getCoverageAmount()) {
            throw new RuntimeException(
                    "Claim amount exceeds policy coverage.");
        }
    }

    // Automatic processing: existing business rules
    public Claim processClaim(Long id) {

        Claim claim =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Claim not found with id: " + id));

        if (!"PENDING".equalsIgnoreCase(claim.getStatus())) {
            throw new RuntimeException(
                    "Only pending claims can be processed.");
        }

        Policy policy = claim.getPolicy();

        if (policy == null) {

            claim.setStatus("REJECTED");
            claim.setRejectionReason(
                    "No policy is associated with this claim.");

            return repository.save(claim);
        }

        if (!"ACTIVE".equalsIgnoreCase(policy.getStatus())) {

            claim.setStatus("REJECTED");
            claim.setRejectionReason("Policy is not active.");

            return repository.save(claim);
        }

        if (claim.getClaimAmount() <= 0) {

            claim.setStatus("REJECTED");
            claim.setRejectionReason(
                    "Claim amount must be greater than zero.");

            return repository.save(claim);
        }

        if (claim.getClaimAmount() > policy.getCoverageAmount()) {

            claim.setStatus("REJECTED");
            claim.setRejectionReason(
                    "Claim amount exceeds policy coverage.");

            return repository.save(claim);
        }

        claim.setStatus("APPROVED");
        claim.setRejectionReason(null);

        return repository.save(claim);
    }

    // Manual approval
    public Claim approveClaim(Long id) {

        Claim claim =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Claim not found with id: " + id));

        if (!"PENDING".equalsIgnoreCase(claim.getStatus())) {
            throw new RuntimeException(
                    "Only pending claims can be approved.");
        }

        validateClaimForApproval(claim);

        claim.setStatus("APPROVED");
        claim.setRejectionReason(null);

        return repository.save(claim);
    }

    // Manual rejection
    public Claim rejectClaim(Long id, String reason) {

        Claim claim =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Claim not found with id: " + id));

        if (!"PENDING".equalsIgnoreCase(claim.getStatus())) {
            throw new RuntimeException(
                    "Only pending claims can be rejected.");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException(
                    "A rejection reason is required.");
        }

        claim.setStatus("REJECTED");
        claim.setRejectionReason(reason.trim());

        return repository.save(claim);
    }

    // Get claims by status
    public List<Claim> getClaimsByStatus(String status) {
        return repository.findByStatus(status);
    }

    // Count claims by status
    public long getClaimCountByStatus(String status) {
        return repository.countByStatus(status);
    }

    // Claim summary
    public Map<String, Long> getClaimSummary() {

        Map<String, Long> summary = new HashMap<>();

        summary.put("pending", repository.countByStatus("PENDING"));
        summary.put("approved", repository.countByStatus("APPROVED"));
        summary.put("rejected", repository.countByStatus("REJECTED"));

        return summary;
    }
}
