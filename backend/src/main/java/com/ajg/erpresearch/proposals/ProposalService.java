package com.ajg.erpresearch.proposals;

import com.ajg.erpresearch.customers.Customer;
import com.ajg.erpresearch.customers.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service 
public class ProposalService{ 
    private final ProposalRepository proposalRepository;
    private final CustomerRepository customerRepository;

    public ProposalService( 
        ProposalRepository proposalRepository, 
        CustomerRepository customerRepository
    ) {
        this.proposalRepository = proposalRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true) 
    public List<ProposalResponse> findAll() {
        return proposalRepository 
            .findAllByOrderByProposalNumberAsc() 
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public ProposalResponse create(
        CreateProposalRequest request
    ) { 
        Customer customer = customerRepository 
            .findById(request.customerId()) 
            .orElseThrow(() -> new ResponseStatusException( 
                HttpStatus.NOT_FOUND, 
                "Customer not found"
            ));
        
        Proposal proposal = new Proposal( 
            generateProposalNumber(), 
            customer, 
            request.title().trim(),
            request.description().trim(), 
            request.estimatedHours(), 
            request.hourlyRate()
            );
        
        Proposal savedProposal = 
            proposalRepository.save(proposal);
        
        return toResponse(savedProposal);    
    }

    @Transactional
    public ProposalResponse accept(Long proposalId) {
        Proposal proposal = proposalRepository 
            .findById(proposalId) 
            .orElseThrow(() -> new ResponseStatusException( 
                HttpStatus.NOT_FOUND, 
                "Proposal not found"
            ));
        if ("Accepted".equals(proposal.getStatus())) {
            return toResponse(proposal);
        }
        if(!"Draft".equals(proposal.getStatus())){ 
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, 
                "Only draft proposals can be accepted"
            );
        }
        proposal.accept(); 
        return toResponse(proposal);
    }

    private String generateProposalNumber() {
        String proposalNumber; 

        do {
            String randomPart = UUID 
                .randomUUID() 
                .toString() 
                .substring(0,8)
                .toUpperCase(Locale.ROOT);

            proposalNumber = "PROP-" + randomPart;
        } while ( 
            proposalRepository.existsByProposalNumber(proposalNumber)
        );
        return proposalNumber;
    }

    private ProposalResponse toResponse(Proposal proposal) {
        Customer customer = proposal.getCustomer();

        return new ProposalResponse( 
            proposal.getId(),
            proposal.getProposalNumber(),
            customer.getId(),
            customer.getCustomerNumber(),
            customer.getCustomerName(), 
            proposal.getTitle(), 
            proposal.getDescription(),
            proposal.getEstimatedHours(), 
            proposal.getHourlyRate(),
            proposal.getTotalAmount(), 
            proposal.getStatus(), 
            proposal.getAcceptedAt()
        );
    }
}
