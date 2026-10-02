package com.ajg.erpresearch.tickets;

import com.ajg.erpresearch.customers.Customer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.ajg.erpresearch.proposals.Proposal;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "service_tickets")
public class ServiceTicket {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "ticket_number", nullable = false, unique = true)
	private String ticketNumber;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "customer_id" , nullable = false)
	private Customer customer;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "proposal_id", unique = true)
	private Proposal proposal;

	@Column(nullable = false, length = 500)
	private String description;

	@Column(nullable = false)
	private String priority;

	@Column(nullable = false)
	private String status;

	private String technician;

	@Column(name = "schedule_date")
	private LocalDate scheduleDate;

	@Column(name = "schedule_time")
	private LocalTime scheduleTime;

	@Column(name="created_at", insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", insertable = false, updatable = false)
	private LocalDateTime updatedAt;

	protected ServiceTicket() {
	}

	public ServiceTicket(
		String ticketNumber,
		Customer customer,
		String description,
		String priority
	) {
		this(
			ticketNumber,
			customer,
			null,
			description,
			priority);
	}

	public ServiceTicket(
		String ticketNumber,
		Customer customer,
		Proposal proposal,
		String description,
		String priority
	) {
		this.ticketNumber = ticketNumber;
		this.customer = customer;
		this.proposal = proposal;
		this.description = description;
		this.priority = priority;
		this.status = "Open";
	}
 
	public void schedule(
		String technician,
		LocalDate scheduleDate,
		LocalTime scheduleTime
	){
		this.technician = technician;
		this.scheduleDate = scheduleDate;
		this.scheduleTime = scheduleTime;
		this.status = "Scheduled";
	}

	public void complete(){ 
		this.status = "Completed";
	}

	public Proposal getProposal(){
		return proposal;
	}

	public Long getId() {
		return id;
	}
	public String getTicketNumber() {
		return ticketNumber;
	}
	public Customer getCustomer() {
		return customer;
	}
	public String getDescription() {
		return description;
	}
	public String getPriority() {
		return priority;
	}
	public String getStatus() {
		return status;
	}
	public String getTechnician() {
		return technician;
	}
	public LocalDate getScheduleDate() {
		return scheduleDate;
	}
	public LocalTime getScheduleTime() {
		return scheduleTime;
	}
}