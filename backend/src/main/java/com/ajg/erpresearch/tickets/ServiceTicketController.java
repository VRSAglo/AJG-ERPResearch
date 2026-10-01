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
}
