package com.ajg.erpresearch.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateServiceTicketRequest(

	@NotNull
	Long customerId, 

	@NotBlank
	@Size(max = 500)
	String description,

	@NotBlank
	@Pattern(regexp = "Low|Medium|High")
	String priority
) {}
