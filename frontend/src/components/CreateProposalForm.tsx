"use client";

import { useState, type FormEvent } from "react";
import type { CustomerSummary } from "../api/customers";

type CreateProposalFormProps = {
    customers: CustomerSummary[];
    isSaving: boolean;
    onSave: (
        customerId: number,
        title: string,
        description: string,
        estimateHours: number,
        hourlyRate: number
    ) => Promise<boolean>;
};

export default function CreateProposalForm(
    props: CreateProposalFormProps
) { 
    const [customerId, setCustomerId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [estimatedHours, setEstimatedHours] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); 

        const wasCreated = await props.onSave(
            Number(customerId),
            title,
            description,
            Number(estimatedHours),
            Number(hourlyRate)
        );

        if (wasCreated) {
            setCustomerId("");
            setTitle("");
            setDescription("");
            setEstimatedHours("");
            setHourlyRate("");
        }
    }

    const calculatedTotal = Number(estimatedHours) * Number(hourlyRate);

    return (
        <section className="new-ticket-section">
            <h2>Create Hourly Proposal</h2>
            <form
                className="new-ticket-form proposal-form"
                onSubmit={handleSubmit}>
                <label>
                    Customer
                    <select value={customerId} onChange={(event) => setCustomerId(event.target.value)}
                        required>
                        <option value="">
                            Select a customer
                        </option>
                        {props.customers.map((customer) => (
                            <option
                                key={customer.id}
                                value={customer.id}>
                                {customer.customerNumber}-{" "}
                                {customer.customerName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Proposal title
                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)}
                        required
                    />
                </label>
                <label className="proposal-form__description">
                    Scope of work
                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        required
                    />
                </label>

                <label>
                    Estimated hours
                    <input
                        type="number"
                        min="0.01"
                        step="0.25"
                        value={estimatedHours}
                        onChange={(event) => setEstimatedHours(event.target.value)}
                        required />
                </label>
                <label>
                    Hourly Rate
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(event) => setHourlyRate(event.target.value)}
                        required />
                </label>
                <div className="proposal-form__total">
                    Estimated total:{" "}
                    <strong>
                        ${calculatedTotal.toFixed(2)}
                    </strong>
                </div>
                <button
                    type="submit"
                    disabled={props.isSaving}>
                    {props.isSaving
                        ? "Creating..." : "Create Proposal"}
                </button>
            </form>
        </section>
    );
}