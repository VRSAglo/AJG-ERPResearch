import type { ServiceTicket } from "../types/serviceTicket";

type TicketTableProps = {
    tickets: ServiceTicket[];
    onSchedule: (ticketId: string) => void;
    onComplete: (ticketId: string) => void;
};
export default function TicketTable(props: TicketTableProps) {
    return (
        <table className="ticket-table">
            <thead>
                <tr>
                    <th>Ticket</th>
                    <th>Customer</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Technician</th>
                    <th>Actions</th>
                    <th>Schedule</th>
                </tr>
            </thead>

            <tbody>
                {props.tickets.map((ticket) => (
                    <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.customer}</td>
                        <td>{ticket.description}</td>
                        <td>{ticket.priority}</td>
                        <td>
                            <span
                                className={`status-badge status-badge--${ticket.status.toLowerCase()}`}
                            >
                                {ticket.status}
                            </span>
                        </td>

                        <td>{ticket.technician}</td>

                        <td>
                            {ticket.status !== "Completed" ? (
                                <button
                                    className="ticket-action"
                                    type="button"
                                    onClick={() => {
                                        if (ticket.status === "Open") {
                                            props.onSchedule(ticket.id);
                                        } else {
                                            props.onComplete(ticket.id);
                                        }}}
                                >
                                    {ticket.status === "Open"
                                        ? "Schedule"
                                        : "Complete"}
                                </button>
                            ) : (
                                <span>Finished</span>
                            )}
                        </td>
                        <td>
                            {ticket.scheduleDate
                                ? `${ticket.scheduleDate} at ${ticket.scheduleTime ?? "Time TBD"}`
                                : "Not scheduled"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}