
package com.example.health_insurance_claim_management.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.health_insurance_claim_management.repository.ClaimRepository;
import com.example.health_insurance_claim_management.repository.CustomerRepository;
import com.example.health_insurance_claim_management.repository.HospitalRepository;
import com.example.health_insurance_claim_management.repository.PolicyRepository;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final HospitalRepository hospitalRepository;
    private final ClaimRepository claimRepository;

    public DashboardService(
            CustomerRepository customerRepository,
            PolicyRepository policyRepository,
            HospitalRepository hospitalRepository,
            ClaimRepository claimRepository) {

        this.customerRepository = customerRepository;
        this.policyRepository = policyRepository;
        this.hospitalRepository = hospitalRepository;
        this.claimRepository = claimRepository;
    }

    public Map<String, Long> getDashboardSummary() {

        Map<String, Long> dashboard = new HashMap<>();

        dashboard.put(
                "totalCustomers",
                customerRepository.count());

        dashboard.put(
                "totalPolicies",
                policyRepository.count());

        dashboard.put(
                "totalHospitals",
                hospitalRepository.count());

        dashboard.put(
                "totalClaims",
                claimRepository.count());

        dashboard.put(
                "pendingClaims",
                claimRepository.countByStatus("PENDING"));

        dashboard.put(
                "approvedClaims",
                claimRepository.countByStatus("APPROVED"));

        dashboard.put(
                "rejectedClaims",
                claimRepository.countByStatus("REJECTED"));

        return dashboard;
    }
}

