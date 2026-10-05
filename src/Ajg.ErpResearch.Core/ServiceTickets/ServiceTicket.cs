namespace Ajg.ErpResearch.Core.ServiceTickets;

public sealed class ServiceTicket
{
    public Guid Id { get; }
    public string TicketNumber { get; }
    public string Description { get; }
    public TicketPriority Priority { get; }
    public TicketStatus Status { get; private set; }
    public string? Technician { get; private set; }
    public DateTimeOffset? ScheduledFor { get; private set; }
    public string CustomerName { get; }

    public ServiceTicket(
        string ticketNumber,
        string customerName,
        string description,
        TicketPriority priority)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(ticketNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(customerName);
        ArgumentException.ThrowIfNullOrWhiteSpace(description);

        Id = Guid.NewGuid();
        TicketNumber = ticketNumber.Trim();
        CustomerName = customerName.Trim();
        Description = description.Trim();
        Priority = priority;
        Status = TicketStatus.Open;
    }

    public void Schedule( 
        string technician,
        DateTimeOffset scheduledFor)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(technician);

        Technician = technician.Trim();
        ScheduledFor = scheduledFor;
        Status = TicketStatus.Scheduled;
        }

   
    public void Complete()
    {
        Status = TicketStatus.Completed;
    }
}