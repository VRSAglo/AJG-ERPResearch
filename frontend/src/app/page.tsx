"use client";
import { useState, type FormEvent } from "react";

type PageHeaderProps = {
     eyebrow?: string;
     title: string;
     description?: string;
 };
function PageHeader(props: PageHeaderProps) {
    return (
        <header className="page-header">
            {props.eyebrow && ( 
                <p className="page-header__eyebrow">{props.eyebrow}</p>
            )}
            <h1 className="page-header__title">{props.title}</h1>
            {props.description && (
                <p className="page-header__description">{props.description}</p>
            ) }
         </header>
    );
};
type SummaryCardProps = {
    label: string;
    value: number;
};
function SummaryCard(props: SummaryCardProps) {
    return (
        <article className="summary-card">
            <p className="summary-card__label">{props.label}</p>
            <p className="summary-card__value">{props.value}</p>
            {/*Display props.value */ }
        </article>
    )
};
type ServiceTicket = {
    id: string;
    customer: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Open" | "Scheduled" | "Completed";
    technician: string;
};
const initialTickets: ServiceTicket[] = [ 
    {
        id: "TKT-1001",
        customer: "Carter Dental", 
        description: "Install network switch", 
        priority: "High", 
        status: "Open", 
        technician: "Unassigned",
    }, 
    {
        id: "TKT-1002", 
        customer: "Palmetto Law Group",
        description: "Troubleshoot wireless access point", 
        priority: "Medium", 
        status: "Scheduled", 
        technician: "Micheal Schmidt",
    }, 
    {
        id: "TKT-1003", 
        customer: "Rivers Coffee",
        description: "Replace damaged network cable", 
        priority: "Low", 
        status: "Completed", 
        technician: "Alex Torres",
    }
]
type StatusFilter = "All" | ServiceTicket["status"];
export default function HomePage() {
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
    function advanceTicketStatus(ticketId: string) {
        setTickets((currentTickets) =>
            currentTickets.map((ticket) => {
                if (ticket.id !== ticketId) {
                    return ticket;
                }
                if (ticket.status === "Open") {
                    return {
                        ...ticket,
                        status: "Scheduled",
                    };
                }
                if (ticket.status === "Scheduled") {
                    return {
                        ...ticket,
                        status: "Completed",
                    };
                }
                return ticket;
            })
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
              <table className="ticket-table">
                <thead>
                      <tr>
                          <th>Ticket</th>
                          <th>Customer</th>
                          <th>Description</th>
                          <th>Priority</th>
                          <th>Status</th>
                              <th>Technicians</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {displayTickets.map((ticket) => (
                      <tr key={ticket.id}>
                              <td>{ticket.id}</td>
                              <td>{ticket.customer}</td>
                              <td>{ticket.description}</td>
                              <td>{ticket.priority}</td>
                              <td>
                                  <span className={`status-badge status-badge--${ticket.status.toLowerCase()}`}>
                                      {ticket.status}
                                  </span>
                              </td>
                              <td>{ticket.technician}</td>
                              <td>
                                  {ticket.status !== "Completed" ? ( 
                                      <button
                                          className="ticket-action"
                                          type="button"
                                          onClick={() => advanceTicketStatus(ticket.id)}
                                      >
                                          {ticket.status === "Open"
                                              ? "Schedule"
                                              :  "Complete" }
                                      </button>
                                  ) : ( 
                                      <span>Finished</span>
                                  )}
                              </td>
                      </tr>
                      )) }
                  </tbody>
                </table>
              </section>
          </div>
    </main>
  );
}
