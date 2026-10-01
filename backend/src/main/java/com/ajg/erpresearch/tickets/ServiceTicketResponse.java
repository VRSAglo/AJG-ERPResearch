package com.ajg.erpresearch.tickets;

import java.time.LocalDate;
import java.time.LocalTime;

public record ServiceTicketResponse(
	Long id,
	String ticketNumber,
	Long customerId,
	String customerNumber,
	String customerName,
	String description,
	String priority,
	String status,
	String technician,
	LocalDate scheduleDate,
	LocalTime scheduleTime
	)
	{
}