package com.ajg.erpresearch.customers;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .map(customer -> new CustomerSummaryResponse(
                        customer.getId(),
                        customer.getCustomerNumber(),
                        customer.getCustomerName()
                ))
                .toList();
    }
}