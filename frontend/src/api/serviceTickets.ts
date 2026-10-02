import type { ServiceTicket } from "../types/serviceTicket";

export type ServiceTicketApiResponse = {
    id: number;
    ticketNumber: string;
    customerId: number;
    customerNumber: string;
    customerName: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Open" | "Scheduled" | "Completed";
    technician: string | null;
    scheduleDate: string | null;
    scheduleTime: string | null;
};

export type CreateServiceTicketRequest = {
    customerId: number;
    description: string;
    priority: ServiceTicket["priority"];
};

export type ScheduleServiceTicketRequest = {
    technician: string;
    scheduleDate: string;
    scheduleTime: string;
};

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8080";

function toServiceTicket(
    ticket: ServiceTicketApiResponse
): ServiceTicket {
    return {
        id: ticket.ticketNumber,
        databaseId: ticket.id,
        customerId: ticket.customerId,
        customerNumber: ticket.customerNumber,
        customer: ticket.customerName,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        technician: ticket.technician ?? "Unassigned",
        scheduleDate: ticket.scheduleDate ?? undefined,
        scheduleTime: ticket.scheduleTime ?? undefined,
    };
}

export async function getServiceTickets():
    Promise<ServiceTicket[]> {
    const response = await fetch(`${API_BASE_URL}/api/tickets`);

    if (!response.ok) {
        throw new Error(
            `Unable to load service tickets: ${response.status}`
        );
    }

    const apiTickets: ServiceTicketApiResponse[] =
        await response.json();

    return apiTickets.map(toServiceTicket);
}

export async function createServiceTicket(
    request: CreateServiceTicketRequest
): Promise<ServiceTicket> {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(
            `Unable to create service ticket: ${response.status}`
        );
    }

    const createdTicket: ServiceTicketApiResponse =
        await response.json();

    return toServiceTicket(createdTicket);
}

export async function scheduleServiceTicket(
    databaseId: number,
    request: ScheduleServiceTicketRequest
): Promise<ServiceTicket> {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${databaseId}/schedule`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    ); 
    if (!response.ok) {
        throw new Error(
            `Unable to schedule service ticket: ${response.status}`
        );
    }
    const updateTicket: ServiceTicketApiResponse =
        await response.json();
    return toServiceTicket(updateTicket);
}

export async function completeServiceTicket(
    databaseId: number
): Promise < ServiceTicket > {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${databaseId}/complete`, 
        {
            method: "PATCH",
        }
    );
    if(!response.ok) {
    throw new Error(
        `Unable to complete service ticket: ${response.status}`
    );
}
const updatedTicket: ServiceTicketApiResponse =
    await response.json();

return toServiceTicket(updatedTicket);
}

export async function createTicketFromProposal(
    proposalId: number,
    priority: ServiceTicket["priority"]
): Promise<ServiceTicket> {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/from-proposal/${proposalId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                priority,
            }),
        }
    );
    if (!response.ok) {
        throw new Error(
            `Unable to create ticket from proposal: ${response.status}`
        );
    }
    const createdTicket: ServiceTicketApiResponse = await response.json();

    return toServiceTicket(createdTicket);
}