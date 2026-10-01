"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getCustomers, type CustomerSummary, } from "../api/customers";
import PageHeader from "../components/PageHeader";
import ScheduleTicketForm from "../components/ScheduleTicketForm";
import SummaryCard from "../components/SummaryCard";
import TicketTable from "../components/TicketTable";
import type { ServiceTicket, StatusFilter, } from "../types/serviceTicket";
import { completeServiceTicket, createServiceTicket, getServiceTickets, scheduleServiceTicket, }
    from "../api/serviceTickets";

export default function HomePage() {
    const [tickets, setTickets] = useState<ServiceTicket[]>([]);
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("All");
    const [schedulingTicketId, setSchedulingTicketId] =
        useState<string | null>(null);

    const [newCustomerId, setNewCustomerId] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] =
        useState<ServiceTicket["priority"]>("Medium");

    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
    const [loadError, setLoadError] =
        useState<string | null>(null);
    const [actionError, setActionError] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [loadedTickets, loadedCustomers] =
                    await Promise.all([
                        getServiceTickets(),
                        getCustomers(),
                    ]);

                setTickets(loadedTickets);
                setCustomers(loadedCustomers);
            } catch (error) {
                setLoadError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load application data"
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    const displayedTickets = tickets.filter((ticket) => {
        if (statusFilter === "All") {
            return true;
        }

        return ticket.status === statusFilter;
    });

    const selectedTicket =
        tickets.find(
            (ticket) => ticket.id === schedulingTicketId
        ) ?? null;

    const totalTickets = tickets.length;
    const openTickets = tickets.filter(
        (ticket) => ticket.status === "Open"
    ).length;
    const scheduledTickets = tickets.filter(
        (ticket) => ticket.status === "Scheduled"
    ).length;

    async function handleAddTicket(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const customerId = Number(newCustomerId);

        if (!customerId || !newDescription.trim()) {
            return;
        }

        setIsCreating(true);
        setActionError(null);

        try {
            const createdTicket = await createServiceTicket({
                customerId,
                description: newDescription.trim(),
                priority: newPriority,
            });

            setTickets((currentTickets) => [
                ...currentTickets,
                createdTicket,
            ]);

            setNewCustomerId("");
            setNewDescription("");
            setNewPriority("Medium");
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to create service ticket"
            );
        } finally {
            setIsCreating(false);
        }
    }

    function beginScheduling(ticketId: string) {
        setSchedulingTicketId(ticketId);
    }

    async function scheduleTicket(
        ticketId: string,
        technician: string,
        scheduleDate: string,
        scheduleTime: string
    ) {
        const ticketToSchedule = tickets.find(
            (ticket) => ticket.id === ticketId
        );

        if (!ticketToSchedule?.databaseId) {
            setActionError(
                "Unable to schedule ticket: database ID is missing"
            );
            return;
        }

        setActionError(null);
        setUpdatingTicketId(ticketId);
        try {
            const updatedTicket = await scheduleServiceTicket(
                ticketToSchedule.databaseId,
                {
                    technician,
                    scheduleDate,
                    scheduleTime,
                }
            );

            setTickets((currentTickets) =>
                currentTickets.map((ticket) =>
                    ticket.databaseId === updatedTicket.databaseId
                        ? updatedTicket
                        : ticket
                )
            );

            setSchedulingTicketId(null);
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to schedule service ticket"
            );
        } finally {
            setUpdatingTicketId(null);
        }
    }
    async function completeTicket(ticketId: string) {
        const ticketToComplete = tickets.find(
            (ticket) => ticket.id === ticketId
        );
        if (!ticketToComplete?.databaseId) {
            setActionError(
                "Unable to complete ticket: database ID is missing"
            );
            return;
        }
        setActionError(null);

        try {
            const updatedTicket = await completeServiceTicket(
                ticketToComplete.databaseId
            );
            setTickets((currentTickets) =>
                currentTickets.map((ticket) =>
                    ticket.databaseId === updatedTicket.databaseId
                        ? updatedTicket : ticket
                )
            );
        } catch (error) {
            setActionError(
                error instanceof Error ? error.message : "Unable to complete service ticket"
            );
        }
    }

    return (
        <main>
            <PageHeader
                eyebrow="Operations"
                title="Service Tickets"
                description="Create, schedule, and monitor customer service work."
            />

            <div className="page-content">
                <h2>Service Ticket Research Prototype</h2>
                <p>
                    Create tickets and manage their service workflow.
                </p>

                <section className="new-ticket-section">
                    <h2>Create Ticket</h2>

                    <form
                        className="new-ticket-form"
                        onSubmit={handleAddTicket}
                    >
                        <label>
                            Customer
                            <select
                                value={newCustomerId}
                                onChange={(event) =>
                                    setNewCustomerId(event.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Select a customer
                                </option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.customerNumber} - {customer.customerName}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Description
                            <input
                                type="text"
                                value={newDescription}
                                onChange={(event) =>
                                    setNewDescription(event.target.value)
                                }
                                placeholder="Describe the requested service"
                                required
                            />
                        </label>

                        <label>
                            Priority
                            <select
                                value={newPriority}
                                onChange={(event) =>
                                    setNewPriority(
                                        event.target.value as ServiceTicket["priority"]
                                    )
                                }
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </label>

                        <button
                            type="submit"
                            disabled={isCreating}
                        >
                            {isCreating
                                ? "Creating..."
                                : "Create Ticket"}
                        </button>
                    </form>

                    {actionError && (
                        <p className="error-message">
                            {actionError}
                        </p>
                    )}
                </section>

                <div className="summary-grid">
                    <SummaryCard
                        label="Total Tickets"
                        value={totalTickets}
                    />
                    <SummaryCard
                        label="Open Tickets"
                        value={openTickets}
                    />
                    <SummaryCard
                        label="Scheduled Tickets"
                        value={scheduledTickets}
                    />
                </div>

                <section className="ticket-section">
                    <h2>Current Tickets</h2>

                    <div className="ticket-toolbar">
                        <label htmlFor="status-filter">
                            Filter by status:
                        </label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value as StatusFilter
                                )
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
                            isSaving={updatingTicketId === selectedTicket.id }
                            onSave={scheduleTicket}
                            onCancel={() =>
                                setSchedulingTicketId(null)
                            }
                        />
                    )}

                    {isLoading && <p>Loading tickets...</p>}

                    {loadError && (
                        <p className="error-message">
                            {loadError}
                        </p>
                    )}

                    {!isLoading && !loadError && (
                        <TicketTable
                            tickets={displayedTickets}
                            updatingTicketId={updatingTicketId}
                            onSchedule={beginScheduling}
                            onComplete={completeTicket}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}
