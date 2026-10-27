package com.example.health_insurance_claim_management.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity 
public class Policy {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String policyNumber;
    private String policyType;
    private double premiumAmount;
    private double coverageAmount;
    private String startDate;
    private String endDate;
    private String status;

    @ManyToOne 
    @JoinColumn (name = "customer_id")
    private Customer customer;

    public Policy(){}

    public Policy(String policyNumber,String policyType,double premiumAmount,double coverageAmount,
        String startDate,String endDate,String status,Customer customer){
            this.policyNumber = policyNumber;
            this.policyType = policyType;
            this.premiumAmount = premiumAmount;
            this.coverageAmount = coverageAmount;
            this.startDate = startDate;
            this.endDate = endDate;
            this.status = status;
            this.customer = customer;
    }

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public String getPolicyNumber(){
        return  policyNumber;
    }

    public void setPolicyNumber(String policyNumber){
        this.policyNumber = policyNumber;
    }

    public String getPolicyType(){
        return  policyType;
    }

    public void setPolicyType(String policyType){
       this.policyType = policyType;
    }

    public void setPremiumAmount(Double premiumAmount){
        this.premiumAmount = premiumAmount;
    }

    public Double getPremiumAmount(){
        return premiumAmount;
    }

    public void setCoverageAmount(Double coverageAmount){
        this.coverageAmount = coverageAmount;
    }
    

    public Double getCoverageAmount(){
        return coverageAmount;
    }

    public String getStartDate(){
        return  startDate;
    }

    public void setStartDate(String startDate){
        this.startDate = startDate;
    }

    public String getEndDate(){
        return  endDate;
    }

    public void setEndDate(String endDate){
        this.endDate = endDate;
    }

    public String getStatus(){
        return  status;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public Customer getCustomer(){
        return customer;
    }

    public void setCustomer(Customer customer){
        this.customer = customer;
    }

    @Override
    public String toString() {
        return "Policy{" +
                "id=" + id +
                ", policyNumber='" + policyNumber + '\'' +
                ", policyType='" + policyType + '\'' +
                ", premiumAmount=" + premiumAmount +
                ", coverageAmount=" + coverageAmount +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", status='" + status + '\'' +
                ", customer=" + customer +
                '}';
    }

}
