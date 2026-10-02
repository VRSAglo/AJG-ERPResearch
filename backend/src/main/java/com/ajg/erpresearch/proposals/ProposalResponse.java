package com.ajg.erpresearch.proposals;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProposalResponse(
    Long id,
    String proposalNumber,
    Long customerId,
    String customerNumber,
    String customerName,
    String title,
    String description,
    BigDecimal estimatedHours,
    BigDecimal hourlyRate,
    BigDecimal totalAmount,
    String status,
    LocalDateTime acceptedAt, 
    Long serviceTicketId,
    String serviceTicketNumber
) {}