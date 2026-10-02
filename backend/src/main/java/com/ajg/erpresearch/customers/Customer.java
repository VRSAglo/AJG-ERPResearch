package com.ajg.erpresearch.customers;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "customer_number", nullable = false, unique = true)
	private String customerNumber;

	@Column(name = "customer_name", nullable = false)
	private String customerName;

	@Column(name = "contact_name")
	private String contactName;

	private String email;

	private String phone;

	@Column(nullable = false)
	private String status;

	@Column(name = "created_at", insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", insertable = false, updatable = false)
	private LocalDateTime updatedAt;

	protected Customer() {
	}
	public Customer(
		String customerNumber,
		String customerName,
		String contactName,
		String email,
		String phone
	) {
		this.customerNumber = customerNumber;
		this.customerName = customerName;
		this.contactName = contactName;
		this.email = email;
		this.phone = phone;
		this.status = "Pending";
	}

	public Long getId() {
	return id;
	}

	public String getCustomerNumber () {
	return customerNumber;
	}

	public String getCustomerName() {
	return customerName;
	}

	public String getContactName() {
		return contactName;
	}

	public String getEmail() {
		return email;
	}

	public String getPhone() {
		return phone;	
	}

	public String getStatus() {
		return status;
	}

	public void activate() {
		this.status = "Active";
	}
}