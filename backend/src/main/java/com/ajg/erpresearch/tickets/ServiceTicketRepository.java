package com.ajg.erpresearch.tickets;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceTicketRepository
	extends JpaRepository<ServiceTicket, Long> {

	@EntityGraph(attributePaths = "customer")
	List<ServiceTicket> findAllByOrderByTicketNumberAsc();

	@EntityGraph(attributePaths = "customer")
	Optional<ServiceTicket> findByTicketNumber(String ticketNumber);

	boolean existsByTicketNumber(String ticketNumber);

	boolean existsByProposalId(Long proposalId);

	Optional<ServiceTicket> findByProposalId(Long proposalId);
}