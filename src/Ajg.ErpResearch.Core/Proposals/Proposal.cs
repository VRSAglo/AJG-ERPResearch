namespace Ajg.ErpResearch.Core.Proposals;

public sealed class Proposal
{
    public Guid Id { get; } = Guid.NewGuid();
    public string ProposalNumber { get; }
    public Guid CustomerId { get; }
    public string CustomerName { get; }
    public string Title { get; }
    public string Description { get; }
    public decimal EstimatedHours { get; }
    public decimal HourlyRate { get; }
    public decimal TotalAmount => decimal.Round(EstimatedHours * HourlyRate, 2);
    public ProposalStatus Status { get; private set; } = ProposalStatus.Draft;
    public DateTimeOffset? AcceptedAt { get; private set; }
    public string? ServiceTicketNumber { get; private set; }

    public Proposal(string proposalNumber, Guid customerId, string customerName, string title,
        string description, decimal estimatedHours, decimal hourlyRate)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(proposalNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(customerName);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(description);
        if (estimatedHours <= 0) throw new ArgumentOutOfRangeException(nameof(estimatedHours));
        if (hourlyRate < 0) throw new ArgumentOutOfRangeException(nameof(hourlyRate));
        ProposalNumber = proposalNumber.Trim();
        CustomerId = customerId;
        CustomerName = customerName.Trim();
        Title = title.Trim();
        Description = description.Trim();
        EstimatedHours = estimatedHours;
        HourlyRate = hourlyRate;
    }

    public void Accept()
    {
        Status = ProposalStatus.Accepted;
        AcceptedAt = DateTimeOffset.Now;
    }

    public void AttachTicket(string ticketNumber)
    {
        if (Status != ProposalStatus.Accepted) throw new InvalidOperationException("Only accepted proposals can create tickets.");
        if (ServiceTicketNumber is not null) throw new InvalidOperationException("A ticket has already been created for this proposal.");
        ServiceTicketNumber = ticketNumber;
    }
}
