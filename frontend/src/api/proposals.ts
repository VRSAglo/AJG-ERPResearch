export type Proposal = {
    id: number;
    proposalNumber: string;
    customerId: number;
    customerNumber: string;
    customerName: string;
    title: string;
    description: string;
    estimatedHours: number;
    hourlyRate: number;
    totalAmount: number;
    status: "Draft" | "Accepted" | "Declined";
    acceptedAt: string | null;
};

export type CreateProposalRequest = {
    customerId: number;
    title: string;
    description: string;
    estimatedHours: number;
    hourlyRate: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getProposal():
    Promise<Proposal[]> {
    const response = await fetch(`${API_BASE_URL}/api/proposals`);

    if (!response.ok) {
        throw new Error(
            `Unable to load proposals: ${response.status}`
        );
    }
    return response.json();
}

export async function createProposal(
    request: CreateProposalRequest
): Promise<Proposal> {
    const response = await fetch(`${API_BASE_URL}/api/proposals`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error( 
            `Unable to create proposal: ${response.status}`
        );
    }
    return response.json();
}

export async function acceptProposal(
    proposalId: number): Promise<Proposal> { 
    const response = await fetch(`${API_BASE_URL}/api/proposals/${proposalId}/accept`, {
        method: "PATCH",
    }
    );
    if (!response.ok) {
        throw new Error(
            `Unable to accept proposal: ${response.status}`);
    }
    return response.json();
}