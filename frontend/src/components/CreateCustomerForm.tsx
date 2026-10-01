"use client";

import { useState, type FormEvent } from "react";

type CreateCustomerFormProps = {
    isSaving: boolean;
    onSave: (
        customerName: string,
        contactName: string,
        email: string,
        phone: string
    ) => Promise<boolean>;
};

export default function CreateCustomerForm(
    props: CreateCustomerFormProps
) {
    const [customerName, setCustomerName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const wasCreated = await props.onSave(
            customerName, contactName, email, phone);

        if (wasCreated) {
            setCustomerName("");
            setContactName("");
            setEmail("");
            setPhone("");
        }
    }
    return (
        <section className="new-ticket-section">
            <h2>Create Customer</h2>
            <form
                className="new-ticket-form customer-form"
                onSubmit={handleSubmit}
            >
                <label>
                    Customer Name
                    <input type="text" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
                </label>
                <label> Contact name
                    <input type="text" value={contactName} onChange={(event) => setContactName(event.target.value)} />
                </label>
                <label>Email
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}  />
                </label>
                <label>Phone
                    <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)}  />
                </label>
                <button type="submit" disabled={props.isSaving}>
                    {props.isSaving ? "Creating..." : "Create Customer"}
                </button>
            </form>
        </section>
    );
}