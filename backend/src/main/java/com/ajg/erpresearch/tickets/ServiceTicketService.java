package com.ajg.erpresearch.tickets;

import com.ajg.erpresearch.customers.Customer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceTicketService {

    private final ServiceTicketRepository ticketRepository;

    public ServiceTicketService(
            ServiceTicketRepository ticketRepository
    ) {
        this.ticketRepository = ticketRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceTicketResponse> findAll() {
        return ticketRepository
                .findAllByOrderByTicketNumberAsc()
                .stream()
                .map(this::toResponse)
                .toList();
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

