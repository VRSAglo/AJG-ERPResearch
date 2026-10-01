"use client";

import { useEffect, useState } from "react";
import {
    createCustomer, getCustomers, type CustomerSummary,
} from "../../api/customers";
import CreateCustomerForm from "../../components/CreateCustomerForm";
import PageHeader from "../../components/PageHeader";

export default function CustomerPage() {
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const[error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCustomers() {
            try {
                const loadedCustomers = await getCustomers();

                setCustomers(loadedCustomers);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Unable to load customers");
            } finally {
                setLoading(false);
            }
        }
        loadCustomers();
    }, []);
    async function handleCreateCustomer(
        customerName: string,
        contactName: string,
        email: string,
        phone: string
    ): Promise<boolean> {
        setIsCreating(true);
        setError(null);

        try {
            const createdCustomer = await createCustomer({
                customerName: customerName.trim(),
                contactName: contactName.trim(),
                email: email.trim(),
                phone: phone.trim(),
            });
            setCustomers((currentCustomers) => [
                ...currentCustomers, createdCustomer].sort(
                    (firstCustomer, secondCustomer) =>
                        firstCustomer.customerName.localeCompare(
                            secondCustomer.customerName
                        )
                ));
        return true;
    } catch (error) {
        setError(
            error instanceof Error ? error.message : "Unable to create customer"
        );
        return false;
    } finally {
        setIsCreating(false);
    }
  }
return (
    <main>
        <PageHeader
            eyebrow="Customer Management"
            title="Customers"
            description="Create and review service customers."
        />

        <div className="page-content">
            <CreateCustomerForm
                isSaving={isCreating}
                onSave={handleCreateCustomer}
            />
            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
            <section className="customer-list-section">
                <h2>Customer Directory</h2>
                {isLoading ? (
                    <p>Loading Customers...</p>
                ) : (
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Customer Number</th>
                                <th>Customer Name</th>
                                <th>Contact Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.customerNumber}</td>
                                    <td>{customer.customerName}</td>
                                    <td>{customer.contactName ?? "Not provided"}</td>
                                    <td>{customer.email ?? "Not provided"}</td>
                                    <td>{customer.phone ?? "Not provided"}</td>
                                    <td>{customer.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    </main>
);
}