package com.example.health_insurance_claim_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.health_insurance_claim_management.model.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital,Long>{
    
}
