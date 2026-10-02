"use client";

import { useEffect, useState } from "react";
import { getServiceTickets, scheduleServiceTicket, } from "../../api/serviceTickets";
import PageHEader from "../../components/PageHeader";
import TicketCalendar from "../../components/TicketCalendar";
import type { ServiceTicket } from "../../types/serviceTicket";
import PageHeader from "../../components/PageHeader";

export default function CalendarPage() {
    const [tickets, setTickets] = useState<ServiceTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTickets() {
            try {
                const loadedTickets =
                    await getServiceTickets();

                setTickets(loadedTickets);
            } catch (error) {
                setError(
                    error instanceof Error ? error.message : "Unable to load calendar"
                );
            } finally {
                setIsLoading(false);
            }
        }
        loadTickets();
    }, []);

    async function handleReschedule(
        ticket: ServiceTicket,
        scheduleDate: string,
        scheduleTime: string
    ): Promise<boolean> {
        if (!ticket.databaseId) {
            setErrpr(
                "Unable to reschedule ticket: database ID is missing"
            );
            return false;
        }

        if (
            !ticket.technician || ticket.technician === "Unassigned"
        ) {
            setError(
                "A technician must be assigned before rescheduling"
            );
            return false;
        }
        setError(null);

        try {
            const updatedTicket = await scheduleServiceTicket(
                ticket.databaseId, {
                technician: ticket.technician,
                scheduleDate,
                scheduleTime,
            }
            );
            setTickets((currentTickets) => currentTickets.map((currentTicket) =>
                currentTicket.databaseId === updatedTicket.databaseId ? updatedTicket : currentTicket));
            return true;
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Unable to reschedule ticket"
            );
            return false;
        }
    }
    return (
        <main>
            <PageHeader
                eyebrow="Operations"
                title="Service Calendar"
                description="View and reschedule service appointments." />

            {error && (
                <div className="page-content">
                    <p className="error-message">
                        {error}
                    </p>
                </div>
            )}
            {isLoading ? (
                <div className="page-content">
                    <p>Loading calender...</p>
                </div>
            ) : (<TicketCalendar tickets={tickets} onReschedule={handleReschedule} />)}
        </main>
    );
}
    