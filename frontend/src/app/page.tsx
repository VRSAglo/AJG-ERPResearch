"use client";
import { useState, type FormEvent } from "react";
import type { ServiceTicket, StatusFilter, } from "../types/serviceTicket";
import { initialTickets } from "../data/initialTickets";
import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import TicketTable from "../components/TicketTable";
import ScheduleTicketForm from "../components/ScheduleTicketForm";




export default function HomePage() {
    const [schedulingTicketId, setSchedulingTicketId] = useState<string | null>(null);
    const [newCustomer, setNewCustomer] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] =
        useState<ServiceTicket["priority"]>("Medium");
    const [tickets, setTickets] =
        useState<ServiceTicket[]>(initialTickets);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
    const displayTickets = tickets.filter((ticket) => {
        if (statusFilter === "All") {
            return true;
        }
        return ticket.status === statusFilter;
    });
    const selectedTicket = tickets.find((ticket) => ticket.id === schedulingTicketId) ?? null;
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(
        (ticket) => ticket.status === "Open"
    ).length;
    const scheduledTickets = tickets.filter(
        (ticket) => ticket.status === "Scheduled"
    ).length;
    function handleAddTicket(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!newCustomer.trim() || !newDescription.trim()) {
            return;
        }
        const newTicket: ServiceTicket = {
            id: `TKT-${1001 + tickets.length}`,
            customer: newCustomer.trim(),
            description: newDescription.trim(),
            priority: newPriority,
            status: "Open",
            technician: "Unassigned",
        };
        setTickets((currentTickets) => [
            ...currentTickets,
            newTicket,
        ]);
        setNewCustomer("");
        setNewDescription("");
        setNewPriority("Medium");
    }
    function beginScheduling(ticketId: string) {
        setSchedulingTicketId(ticketId);
    }
    function scheduleTicket(
        ticketId: string,
        technician: string,
        scheduleDate: string,
        scheduleTime: string
    ) {
        setTickets((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === ticketId
                    ? {
                        ...ticket,
                        technician,
                        scheduleDate,
                        scheduleTime,
                        status: "Scheduled",
                    }
                    : ticket));
        setSchedulingTicketId(null);
    }

    function completeTicket(ticketId: string) {
        setTickets((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === ticketId
                    ? {
                        ...ticket,
                        status: "Completed",
                    }
                    : ticket
            )
        );
    }
  return(
     <main>
        <PageHeader
                 eyebrow="Operations"
                 title="Service Tickets"
                 description="Create, Schedule, and monitor customer service work."
          />
        <div className="page-content">
      <h2>Service Ticket Research Prototype</h2>
          <p>The first interactive feature will be implemented during the guided exercise.</p>
              <section className="new-ticket-section">
              <h2>Create Ticket</h2>
                  <form className="new-ticket-form" onSubmit={handleAddTicket}>
                      <label>
                          Customer
                          <input
                              type="text"
                              value={newCustomer}
                              onChange={(event) => setNewCustomer(event.target.value)}
                              placeholder="Customer name"
                              required
                              />
                      </label>
                      <label>
                          Description
                          <input
                              type="text"
                              value={newDescription}
                              onChange={(event) => setNewDescription(event.target.value)}
                              placeholder="Describe the requested service"
                              required/>
                      </label>
                      <label>
                          Priority
                          <select
                              value={newPriority}
                              onChange={(event) =>
                                  setNewPriority(
                                      event.target.value as ServiceTicket["priority"]
                                  )}
                          >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                      </select> 
                      </label>
                      <button type="submit">Create Ticket</button>
                  </form>
              </section>
              <div className="summary-grid">
                  <SummaryCard label="Total Tickets" value={totalTickets} />
                  <SummaryCard label="Open Tickets" value={openTickets} />
                  <SummaryCard label="Scheduled Tickets" value={scheduledTickets} />
              </div>
              <section className="ticket-section">
                  <h2>Current Tickets</h2>
                  <div className="ticket-toolbar">
                      <label htmlFor="status-filter">Filter by status:</label>
                      <select
                          id="status-filter"
                          value={statusFilter}
                          onChange={(event) =>
                      setStatusFilter(event.target.value as StatusFilter)
                          }
                      >
                      <option value="All">All</option>
                      <option value="Open">Open</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      </select>
                  </div>
                  {selectedTicket && (
                      <ScheduleTicketForm
                          ticket={selectedTicket}
                          onSave={scheduleTicket}
                          onCancel={() => setSchedulingTicketId(null)}
                          />
                  ) }
                  <TicketTable
                      tickets={displayTickets}
                      onSchedule={beginScheduling}
                      onComplete={completeTicket}
                  />
              </section>
          </div>
    </main>
  );
}
