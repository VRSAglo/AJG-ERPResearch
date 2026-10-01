package com.ajg.erpresearch.customers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(
            CustomerService customerService
    ) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<CustomerSummaryResponse> findAll() {
        return customerService.findAll();
    }
    @PostMapping@ResponseStatus(HttpStatus.CREATED)
    public CustomerSummaryResponse create(
        @Valid @RequestBody CreateCustomerRequest request
    ) { 
        return customerService.create(request);
    }
}