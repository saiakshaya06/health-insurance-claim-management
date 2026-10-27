package com.example.health_insurance_claim_management.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String claimNumber;
    private double claimAmount;
    private String claimDate;
    private String description;
    private String status;
    private String rejectionReason;
    @ManyToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Transient
    private Long policyId;

    @Transient
    private Long hospitalId;

    public Claim() {
    }

    public Claim(String claimNumber,
                 double claimAmount,
                 String claimDate,
                 String description,
                 String status,
                 Policy policy,
                 Hospital hospital) {

        this.claimNumber = claimNumber;
        this.claimAmount = claimAmount;
        this.claimDate = claimDate;
        this.description = description;
        this.status = status;
        this.policy = policy;
        this.hospital = hospital;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public double getClaimAmount() {
        return claimAmount;
    }

    public void setClaimAmount(double claimAmount) {
        this.claimAmount = claimAmount;
    }

    public String getClaimDate() {
        return claimDate;
    }

    public void setClaimDate(String claimDate) {
        this.claimDate = claimDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Policy getPolicy() {
        return policy;
    }

    public void setPolicy(Policy policy) {
        this.policy = policy;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public Long getPolicyId() {
        return policyId;
    }

    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    @Override
    public String toString() {
        return "Claim{" +
                "id=" + id +
                ", claimNumber='" + claimNumber + '\'' +
                ", claimAmount=" + claimAmount +
                ", claimDate='" + claimDate + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", policy=" + policy +
                ", hospital=" + hospital +
                '}';
    }
    public String getRejectionReason() {
    return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}