package com.example.health_insurance_claim_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.health_insurance_claim_management.model.Customer;
import com.example.health_insurance_claim_management.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public Customer createCustomer(Customer customer) {
        return repository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return repository.findById(id);
    }

    // Admin/Agent updates a customer by ID
    public Customer updateCustomer(Long id, Customer customer) {
        Customer existingCustomer = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found with id: " + id));

        existingCustomer.setName(customer.getName());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setAddress(customer.getAddress());
        existingCustomer.setDateOfBirth(customer.getDateOfBirth());

        return repository.save(existingCustomer);
    }

    // Customer updates their own profile using their login username
    public Customer updateMyProfile(
            String username, Customer customer) {

        Customer existingCustomer = repository
                .findByUserUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer profile not found."));

        existingCustomer.setName(customer.getName());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setAddress(customer.getAddress());

        return repository.save(existingCustomer);
    }

    public void deleteCustomer(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Customer not found with id: " + id);
        }

        repository.deleteById(id);
    }

    public Customer getMyProfile(String username) {
        return repository.findByUserUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer profile not found."));
    }
}