package com.ajg.erpresearch.tickets;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tickets")
public class ServiceTicketController {

    private final ServiceTicketService ticketService;

    public ServiceTicketController(
            ServiceTicketService ticketService
    ) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public List<ServiceTicketResponse> findAll() {
        return ticketService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceTicketResponse create(
        @Valid @RequestBody
        CreateServiceTicketRequest request
        ) {
        return ticketService.create(request);
        }

    @PatchMapping("/{ticketId}/schedule")
    public ServiceTicketResponse schedule(
        @PathVariable Long ticketId,
        @Valid @RequestBody ScheduleServiceTicketRequest request
       ) {
        return ticketService.schedule(ticketId, request);
       }

    @PatchMapping("/{ticketId}/complete")
    public ServiceTicketResponse complete(
        @PathVariable Long ticketId
        ) {
            return ticketService.complete(ticketId);
            }

    @PostMapping("/from-proposal/{proposalId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceTicketResponse createFromProposal(
        @PathVariable Long proposalId,
        @Valid @RequestBody
        CreateTicketFromProposalRequest request 
    ) {
        return ticketService.createFromProposal(proposalId, request);
    }
}
