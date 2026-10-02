"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import themePlugin from "@fullcalendar/react/themes/monarch";

import type { ServiceTicket } from "../types/serviceTicket";

type TicketCalendarProps = {
    tickets: ServiceTicket[];
    onReschedule: (
        ticket: ServiceTicket,
        scheduleDate: string,
        scheduleTime: string
    ) => Promise<boolean>;
};

function pad(value: number) {
    return String(value).padStart(2, "0");
}

function formatLocalDate(date: Date) {
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
    ].join("-");
}

function formatLocalTime(date: Date) {
    return [
        pad(date.getHours()),
        pad(date.getMinutes()),
        "00",
    ].join(":");
}

export default function TicketCalendar(
    props: TicketCalendarProps
) {
    const events = props.tickets
        .filter(
            (ticket) =>
                ticket.scheduleDate &&
                ticket.scheduleTime
        )
        .map((ticket) => ({
            id: ticket.id,
            title: `${ticket.id} - ${ticket.customer}`,
            start:
                `${ticket.scheduleDate}T${ticket.scheduleTime}`,
            editable: ticket.status !== "Completed",
            backgroundColor:
                ticket.status === "Completed"
                    ? "#64748b"
                    : "#0b4f8a",
            borderColor:
                ticket.status === "Completed"
                    ? "#475569"
                    : "#083b68",
        }));

    return (
        <div className="ticket-calendar">
            <FullCalendar
                plugins={[
                    themePlugin,
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                ]}
                
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                editable
                eventDurationEditable={false}
                nowIndicator
                height="auto"
                eventDrop={async (info) => {
                    const ticket = props.tickets.find(
                        (candidate) =>
                            candidate.id === info.event.id
                    );

                    const newStart = info.event.start;

                    if (!ticket || !newStart) {
                        info.revert();
                        return;
                    }

                    const wasSaved =
                        await props.onReschedule(
                            ticket,
                            formatLocalDate(newStart),
                            formatLocalTime(newStart)
                        );

                    if (!wasSaved) {
                        info.revert();
                    }
                }}
            />
        </div>
    );
}