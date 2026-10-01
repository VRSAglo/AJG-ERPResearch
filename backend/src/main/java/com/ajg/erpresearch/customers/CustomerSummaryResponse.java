package com.ajg.erpresearch.customers;

public record CustomerSummaryResponse(
	Long id,
	String customerNumber,
	String customerName
	){}