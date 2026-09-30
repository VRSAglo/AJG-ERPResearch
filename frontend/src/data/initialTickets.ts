import type { ServiceTicket } from "../types/serviceTicket";

export const initialTickets: ServiceTicket[] = [
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