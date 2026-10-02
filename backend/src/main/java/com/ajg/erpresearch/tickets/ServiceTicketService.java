package com.ajg.erpresearch.tickets;

import com.ajg.erpresearch.customers.Customer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ajg.erpresearch.customers.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.ajg.erpresearch.proposals.Proposal;
import com.ajg.erpresearch.proposals.ProposalRepository;

import java.util.Locale;
import java.util.UUID;
import java.util.List;

@Service
public class ServiceTicketService {

    private final ServiceTicketRepository ticketRepository;
    private final CustomerRepository customerRepository;
    private final ProposalRepository proposalRepository;

    public ServiceTicketService(
        ServiceTicketRepository ticketRepository,
        CustomerRepository customerRepository,
        ProposalRepository proposalRepository
        ) {
        this.ticketRepository = ticketRepository;
        this.customerRepository = customerRepository;
        this.proposalRepository = proposalRepository;
      }

    @Transactional(readOnly = true)
    public List<ServiceTicketResponse> findAll() {
        return ticketRepository
                .findAllByOrderByTicketNumberAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ServiceTicketResponse create(
        CreateServiceTicketRequest request
       ) {
       Customer customer = customerRepository
            .findById(request.customerId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Customer not found"
            ));

    String ticketNumber = generateTicketNumber();

    ServiceTicket ticket = new ServiceTicket (
        ticketNumber,
        customer,
        request.description().trim(),
        request.priority()
    );

    ServiceTicket savedTicket =
        ticketRepository.save(ticket);

    return toResponse(savedTicket);
    }
@Transactional
public ServiceTicketResponse createFromProposal(
    Long proposalId,
    CreateTicketFromProposalRequest request ) {
        Proposal proposal = proposalRepository
        .findById(proposalId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, 
            "Proposal not found"
        ));
        if(!"Accepted".equals(proposal.getStatus())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Proposal must be accepted before creating a ticket"
        );
        }
        if (ticketRepository.existsByProposalId(proposalId)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A service ticket already exists for this proposal"
            );
        }

        ServiceTicket ticket = new ServiceTicket(
            generateTicketNumber(),
            proposal.getCustomer(),
            proposal,
            proposal.getTitle(),
            request.priority()
        );
        ServiceTicket savedTicket = 
        ticketRepository.save(ticket);

        return toResponse(savedTicket);
    }

    private String generateTicketNumber() {
        String ticketNumber;

         do {
            String randomPart = UUID
                .randomUUID()
                .toString()
                .substring(0,8)
                .toUpperCase(Locale.ROOT);

                ticketNumber = "TKT-" + randomPart;
            } while (
                ticketRepository.existsByTicketNumber(ticketNumber)
            );
            return ticketNumber;
    }

    @Transactional
    public ServiceTicketResponse schedule(
        Long ticketId,
        ScheduleServiceTicketRequest request
    ) {
        ServiceTicket ticket = ticketRepository
            .findById(ticketId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                    "Service ticket not found"
             ));
        ticket.schedule(
            request.technician().trim(),
            request.scheduleDate(),
            request.scheduleTime()
        );
        return toResponse(ticket);
    }

    @Transactional
    public ServiceTicketResponse complete(Long ticketId){
        ServiceTicket ticket = ticketRepository
            .findById(ticketId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Service ticket not found"
                ));
            ticket.complete();
            return toResponse(ticket);
    }

    private ServiceTicketResponse toResponse(
            ServiceTicket ticket
    ) {
        Customer customer = ticket.getCustomer();

        return new ServiceTicketResponse(
                ticket.getId(),
                ticket.getTicketNumber(),
                customer.getId(),
                customer.getCustomerNumber(),
                customer.getCustomerName(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getTechnician(),
                ticket.getScheduleDate(),
                ticket.getScheduleTime()
        );
    }
}

