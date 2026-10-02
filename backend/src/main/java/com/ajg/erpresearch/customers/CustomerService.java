package com.ajg.erpresearch.customers;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.UUID;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(
            CustomerRepository customerRepository
    ) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerSummaryResponse> findAll() {
        return customerRepository
                .findAllByOrderByCustomerNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }
    @Transactional
    public CustomerSummaryResponse create(
        CreateCustomerRequest request
    ) {
        String customerNumber = generateCustomerNumber();

        Customer customer = new Customer(
            customerNumber,
            request.customerName().trim(),
            normalizeOptional(request.contactName()),
            normalizeOptional(request.email()),
            normalizeOptional(request.phone())
        );
        Customer savedCustomer =
            customerRepository.save(customer);

        return toResponse(savedCustomer);
    }

    private String generateCustomerNumber() {
        String customerNumber;

        do {
            String randomPart = UUID    
                .randomUUID()
                .toString()
                .substring(0,8)
                .toUpperCase(Locale.ROOT);

            customerNumber = "CUST-" + randomPart;
        } while (
            customerRepository.existsByCustomerNumber(customerNumber)
        );
        return customerNumber;
    } 

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private CustomerSummaryResponse toResponse(Customer customer) {
        return new CustomerSummaryResponse(
                customer.getId(),
                customer.getCustomerNumber(),
                customer.getCustomerName(),
                customer.getContactName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getStatus()
        );
    }

    @Transactional
    public CustomerSummaryResponse activate(Long customerId) {
        Customer customer = customerRepository
            .findById(customerId) 
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Customer not found"
            ));
            customer.activate();

            return toResponse(customer);
    }

}