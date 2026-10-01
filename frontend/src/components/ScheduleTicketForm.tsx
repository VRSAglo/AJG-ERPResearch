"use client";

import { useState, type FormEvent } from "react";

import type { ServiceTicket } from "../types/serviceTicket";


type SchedulingTicketFormProps = {
    ticket: ServiceTicket;
    onSave: (
        ticketId: string,
        technician: string,
        scheduleDate: string,
        scheduleTime: string
    ) => void;
    onCancel: () => void;
};

export default function ScheduleTicketForm(
    props: SchedulingTicketFormProps
) {
    const [technician, setTechnician] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduledTime] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        props.onSave(
            props.ticket.id,
            technician,
            scheduleDate,
            scheduleTime
        );
    }

    return (
        <section className="schedule-form-section">
            <h3>Schedule {props.ticket.id}</h3>
            <p>
                {props.ticket.customer}: {props.ticket.description}
            </p>

            <form className="schedule-form" onSubmit={handleSubmit}>
                <label>
                    Technician
                    <select
                        value={technician}
                        onChange={(event) => setTechnician(event.target.value)}
                        required
                    >
                        <option value="">Select a technician</option>
                        <option value="Michael Schmit">Michael Schmidt</option>
                        <option value="Alex Torres">Alex Torres</option>
                        <option value="Jordan Lee">Jordan Lee</option>
                    </select>
                </label>
                <label>
                    Date
                    <input
                        type="date"
                        value={scheduleDate}
                        onChange={(event) => setScheduleDate(event.target.value)}
                        required />
                </label>
                <label>
                    Time
                    <input
                        type="time"
                        value={scheduleTime}
                        onChange={(event) => setScheduledTime(event.target.value)}
                        required
                    />
                </label>
                <div className="schedule-form__actions">
                    <button type="submit">Save Schedule</button>
                    <button type="button" onClick={props.onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
}