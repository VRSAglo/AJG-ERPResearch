package com.ajg.erpresearch.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record ScheduleServiceTicketRequest(

	@NotBlank
	@Size(max = 150)
	String technician,

	@NotNull
	LocalDate scheduleDate,

	@NotNull
	LocalTime scheduleTime
) {
}