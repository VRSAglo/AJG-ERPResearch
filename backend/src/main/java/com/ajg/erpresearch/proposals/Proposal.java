package com.ajg.erpresearch.proposals;

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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Entity
@Table(name = "proposals")
public class Proposal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
        name = "proposal_number",
        nullable = false,
        unique = true
    )
    private String proposalNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "estimated_hours", nullable = false)
    private BigDecimal estimatedHours;

    @Column(name = "hourly_rate", nullable = false)
    private BigDecimal hourlyRate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(
        name = "created_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
        name = "updated_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime updatedAt;

    protected Proposal() {}

    public Proposal(
        String proposalNumber,
        Customer customer,
        String title,
        String description,
        BigDecimal estimatedHours,
        BigDecimal hourlyRate
    ) { 
        this.proposalNumber = proposalNumber;
        this.customer = customer;
        this.title = title;
        this.description = description;
        this.estimatedHours = estimatedHours;
        this.hourlyRate = hourlyRate;
        this.totalAmount = estimatedHours
        .multiply(hourlyRate)
        .setScale(2, RoundingMode.HALF_UP);
        this.status = "Draft";
    }
    public void accept(){
        this.status = "Accepted";
        this.acceptedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getProposalNumber() {
        return  proposalNumber;
    }

    public Customer getCustomer() {
        return customer;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getEstimatedHours() {
        return estimatedHours;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }
}   