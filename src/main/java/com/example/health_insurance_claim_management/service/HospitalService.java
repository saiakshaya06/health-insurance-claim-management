package com.example.health_insurance_claim_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.health_insurance_claim_management.model.Hospital;
import com.example.health_insurance_claim_management.repository.HospitalRepository;

@Service 
public class HospitalService {
    private final HospitalRepository repository;

    public HospitalService(HospitalRepository repository){
        this.repository = repository;
    }

    public Hospital createHospital(Hospital hospital) {
        return repository.save(hospital);
    }

    // Get all Hospitals
    public List<Hospital> getAllHospitals() {
        return repository.findAll();
    }

    // Get Hospital by ID
    public Optional<Hospital> getHospitalById(Long id) {
        return repository.findById(id);
    }

    // Update Hospital
    public Hospital updateHospital(Long id, Hospital hospital) {

        Hospital existingHospital = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Hospital not found with id: " + id));

        existingHospital.setHospitalName(hospital.getHospitalName());
        existingHospital.setHospitalCode(hospital.getHospitalCode());
        existingHospital.setAddress(hospital.getAddress());
        existingHospital.setCity(hospital.getCity());
        existingHospital.setPhone(hospital.getPhone());
        existingHospital.setEmail(hospital.getEmail());

        return repository.save(existingHospital);
    }

    public void deleteHospital(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Hospital not found with id: " + id);
        }
        repository.deleteById(id);
    }

}
