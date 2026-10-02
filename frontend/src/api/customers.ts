export type CustomerSummary = {
    id: number;
    customerNumber: string;
    customerName: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
    status: string;
};
export type CreateCustomerRequest = {
    customerName: string;
    contactName: string;
    email: string;
    phone: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8080";

export async function getCustomers():
    Promise<CustomerSummary[]> {
    const response = await fetch(`${API_BASE_URL}/api/customers`);

    if (!response.ok) {
        throw new Error(
            `Unable to load customers: ${response.status}`
        );
    }
    return response.json();
}

export async function createCustomer(
    request: CreateCustomerRequest
): Promise<CustomerSummary> {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        throw new Error(
            `Unable to create customer: ${response.status}`
        );
    }
    return response.json();
}

export async function activateCustomer(
    customerId: number
): Promise<CustomerSummary> {
    const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/activate`,
        {
            method: "PATCH",
        });

    if (!response.ok) {
        throw new Error(
            `Unable to activate customer: ${response.status}`
        );
    }
    return response.json();
}