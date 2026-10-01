export type CustomerSummary = {
    id: number;
    customerNumber: string;
    customerName: string;
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