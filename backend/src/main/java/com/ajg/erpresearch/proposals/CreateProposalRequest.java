package com.ajg.erpresearch.proposals;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateProposalRequest(
    @NotNull
    Long customerId,

    @NotBlank
    @Size(max = 150)
    String title,

    @NotBlank
    @Size(max = 1000)
    String description, 

    @NotNull
    @DecimalMin(value = "0.01")
    @Digits(integer = 6, fraction = 2)
    BigDecimal estimatedHours,

    @NotNull
    @DecimalMin(value = "0.00")
    @Digits(integer = 8, fraction = 2)
    BigDecimal hourlyRate
) {}