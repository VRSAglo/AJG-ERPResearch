package com.ajg.erpresearch.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateTicketFromProposalRequest(
    @NotBlank
    @Pattern(regexp = "Low|Medium|High")
    String priority
) {}