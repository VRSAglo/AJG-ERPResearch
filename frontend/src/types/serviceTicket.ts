export type ServiceTicket = {
    id: string;
    customer: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Open" | "Scheduled" | "Completed";
    technician: string;
    scheduleDate?: string;
    scheduleTime?: string;
};
export type StatusFilter = "All" | ServiceTicket["status"];