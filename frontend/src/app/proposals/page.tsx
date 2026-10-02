"use client";

import { useEffect, useState } from "react";
import { getCustomers, type CustomerSummary, } from "../../api/customers";
import { acceptProposal, createProposal, getProposal, type Proposal, } from "../../api/proposals";
import CreateProposalForm from "../../components/CreateProposalForm";
import PageHeader from "../../components/PageHeader";
import { createTicketFromProposal } from "../../api/serviceTickets";
import type { ServiceTicket } from "../../types/serviceTicket";

export default function ProposalsPage() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [updatingProposalId, setUpdatingProposalId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [creatingTicketProposalId, setCreatingTicketProposalId] = useState<number | null>(null);
    const [ticketPriorities, setTicketPriorities] = useState<Record<number, ServiceTicket["priority"]>>({});
    const activeCustomers = customers.filter((customer) => customer.status === "Active");

    useEffect(() => {
        async function loadData() {
            try {
                const [loadedProposals, loadedCustomers] =
                    await Promise.all([
                        getProposal(),
                        getCustomers(),
                    ]);

                setProposals(loadedProposals);
                setCustomers(loadedCustomers);
            } catch (error) {
                setError(
                    error instanceof Error ? error.message : "Unable to load proposal data"
                );
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    async function handleCreateProposal(
        customerId: number,
        title: string,
        description: string,
        estimatedHours: number,
        hourlyRate: number
    ): Promise<boolean> {
        setIsCreating(true);
        setError(null);

        try {
            const createdProposal = await createProposal({
                customerId,
                title: title.trim(),
                description: description.trim(),
                estimatedHours,
                hourlyRate,
            });

            setProposals((currentProposals) => [
                ...currentProposals,
                createdProposal,
            ]);

            return true;
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Unable to create proposal"
            );
            return false;
        } finally {
            setIsCreating(false);
        }
    }

    async function handleAcceptProposal(
        proposalsId: number) {
        setUpdatingProposalId(proposalsId);
        setError(null);

        try {
            const updatedProposal =
                await acceptProposal(proposalsId);

            setProposals((currentProposals) =>
                currentProposals.map((proposal) =>
                    proposal.id === updatedProposal.id ? updatedProposal : proposal));
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Unable to accept proposal"
            );
        } finally {
            setUpdatingProposalId(null);
        }
    }
    return (
        <main>
            <PageHeader
                eyebrow="Sales"
                title="Proposals"
                description="Create and accept hourly service proposals." />

            <div className="page-content">
                <CreateProposalForm
                    customers={activeCustomers}
                    isSaving={isCreating}
                    onSave={handleCreateProposal} />
                {error && (<p className="error-message">{error}</p>)}

                <section className="ticket=section">
                    <h2>Proposal Directory</h2>
                    {isLoading ? (
                        <p>Loading proposals...</p>
                    ) : proposals.length === 0 ? (
                        <p>No Proposals have been created.</p>
                    ) : (
                        <table className="ticket-table">
                            <thead>
                                <tr>
                                    <th>Proposals</th>
                                    <th>Customers</th>
                                    <th>Title</th>
                                    <th>Hours</th>
                                    <th>Rate</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proposals.map((proposal) => (
                                    <tr key={proposal.id}>
                                        <td>{proposal.proposalNumber}</td>
                                        <td>{proposal.customerName}</td>
                                        <td>{proposal.title}</td>
                                        <td>{proposal.estimatedHours}</td>
                                        <td>${proposal.hourlyRate.toFixed(2)}</td>
                                        <td>${proposal.totalAmount.toFixed(2)}</td>
                                        <td>
                                            {proposal.serviceTicketNumber ? (
                                                <span>
                                                    Ticket {proposal.serviceTicketNumber} created
                                                </span>
                                            ) : proposal.status === "Draft" ? (
                                                <button
                                                    className="ticket-action"
                                                    type="button"
                                                    disabled={
                                                        updatingProposalId === proposal.id
                                                    }
                                                    onClick={() =>
                                                        handleAcceptProposal(proposal.id)
                                                    }
                                                >
                                                    {updatingProposalId === proposal.id
                                                        ? "Accepting..."
                                                        : "Accept"}
                                                </button>
                                            ) : proposal.status === "Accepted" ? (
                                                <div className="proposal-ticket-action">
                                                    <select
                                                        value={
                                                            ticketPriorities[proposal.id] ??
                                                            "Medium"
                                                        }
                                                        onChange={(event) =>
                                                            setTicketPriorities(
                                                                (currentPriorities) => ({
                                                                    ...currentPriorities,
                                                                    [proposal.id]:
                                                                        event.target.value as
                                                                        ServiceTicket["priority"],
                                                                })
                                                            )
                                                        }
                                                        disabled={
                                                            creatingTicketProposalId ===
                                                            proposal.id
                                                        }
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                    </select>

                                                    <button
                                                        className="ticket-action"
                                                        type="button"
                                                        disabled={
                                                            creatingTicketProposalId ===
                                                            proposal.id
                                                        }
                                                        onClick={() =>
                                                            handleCreateTicket(proposal.id)
                                                        }
                                                    >
                                                        {creatingTicketProposalId === proposal.id
                                                            ? "Creating..."
                                                            : "Create Ticket"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span>{proposal.status}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}
                </section>
            </div>
        </main>
    );


    async function handleCreateTicket(
        proposalId: number
    ) {
        setCreatingTicketProposalId(proposalId);
        setError(null);

        try {
            const priority = ticketPriorities[proposalId] ?? "Medium";

            await createTicketFromProposal(
                proposalId,
                priority
            );

            const refreshedProposal = await getProposal();
            setProposals(refreshedProposal);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Unable to create ticket from proposal"
            );
        } finally {
            setCreatingTicketProposalId(null);
        }
}

}