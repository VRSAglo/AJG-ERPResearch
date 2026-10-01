package com.ajg.erpresearch.customers;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCustomerRequest(
    @NotBlank
    @Size(max = 150)
    String customerName,

    @Size(max = 150)
    String contactName,

    @Email
    @Size(max = 255)
    String email,

    @Size(max = 30)
    String phone
) {

}