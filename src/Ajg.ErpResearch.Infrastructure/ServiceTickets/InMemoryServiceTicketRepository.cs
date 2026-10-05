using Ajg.ErpResearch.Core.ServiceTickets;

namespace Ajg.ErpResearch.Infrastructure.ServiceTickets;

public sealed class InMemoryServiceTicketRepository 
	: IServiceTicketRepository
	{
	private readonly object syncRoot = new();

	private readonly List<ServiceTicket> tickets =
	[
	new ServiceTicket(
		"TKT-1001",
		"Carter Dental",
		"Install network switch",
		TicketPriority.High),
	new ServiceTicket(
		"TKT-1002",
		"Palmetto Law Group",
		"Troubleshoot wireless access point",
		TicketPriority.Medium),

	new ServiceTicket(
		"TKT-1003",
		"Rivers Coffe",
		"Replace damaged network cable",
		TicketPriority.Low)
	];

	public Task<IReadOnlyList<ServiceTicket>> GetAllAsync(
		CancellationToken cancellationToken = default)
		{
		cancellationToken.ThrowIfCancellationRequested();

		lock(syncRoot)
		{
			IReadOnlyList<ServiceTicket> result = tickets
				.OrderBy(ticket => ticket.TicketNumber)
				.ToArray();

				return Task.FromResult(result);
		}
	}

	public Task<ServiceTicket?> GetByIdAsync(
		Guid id,
		CancellationToken cancellationToken = default)
		{
		cancellationToken.ThrowIfCancellationRequested();
		
		lock (syncRoot){
			var ticket = tickets.FirstOrDefault(
				candidate => candidate.Id == id);

				return Task.FromResult(ticket);
		}
	}
	
	public Task AddAsync(
		ServiceTicket ticket,
		CancellationToken cancellationToken = default)
		{
		ArgumentNullException.ThrowIfNull(ticket);
		cancellationToken.ThrowIfCancellationRequested();

		lock(syncRoot)
		{
			tickets.Add(ticket);
		}
		return Task.CompletedTask;
		}
	public Task UpdateAsync (ServiceTicket ticket, CancellationToken cancellationToken = default)
	{
		ArgumentNullException.ThrowIfNull(ticket);
		cancellationToken.ThrowIfCancellationRequested();

		lock (syncRoot)
		{
			var index = tickets.FindIndex(
				candidate => candidate.Id == ticket.Id);

			if (index < 0)
			{
				throw new InvalidOperationException($"Ticket {ticket.Id} was not found.");
			}
			tickets[index] = ticket;
		}
		return Task.CompletedTask;
	}
}