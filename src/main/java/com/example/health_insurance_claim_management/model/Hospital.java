package com.example.health_insurance_claim_management.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity 
public class Hospital {

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String hospitalName;
    private String hospitalCode;
    private String address;
    private String city;
    private String phone;
    private String email;

    public  Hospital(){}

    public Hospital(String hospitalName,String hospitalCode,String address,String city,String phone,String email){
        this.hospitalName = hospitalName;
        this.hospitalCode = hospitalCode;
        this.address = address;
        this.city = city;
        this.phone = phone;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getHospitalCode() {
        return hospitalCode;
    }

    public void setHospitalCode(String hospitalCode) {
        this.hospitalCode = hospitalCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Hospital{" +
                "id=" + id +
                ", hospitalName='" + hospitalName + '\'' +
                ", hospitalCode='" + hospitalCode + '\'' +
                ", address='" + address + '\'' +
                ", city='" + city + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
