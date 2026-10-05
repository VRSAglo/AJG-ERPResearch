using Ajg.ErpResearch.Core.ServiceTickets;
using Xunit;

namespace Ajg.ErpResearch.Tests.ServiceTickets;

public sealed class ServiceTicketTests
{
	[Fact]
	public void Constructor_CreatesOpenTicket()
	{
		var ticket = new ServiceTicket(
			"TKT-1001",
			"Carter Dental",
			"Install network switch",
			TicketPriority.High);

		Assert.NotEqual(Guid.Empty, ticket.Id);
		Assert.Equal("TKT-1001", ticket.TicketNumber);
		Assert.Equal("Carter Dental", ticket.CustomerName);
		Assert.Equal(TicketStatus.Open, ticket.Status);
		Assert.Null(ticket.Technician);
		Assert.Null(ticket.ScheduledFor);
	}

	[Fact]
	public void Schedule_AssignsTechnicianAndDate()
	{
		var ticket = CreateTicket();
		var scheduledFor = new DateTimeOffset(2026, 10, 5,9,30,0 , TimeSpan.Zero);
		ticket.Schedule("Alex Torres", scheduledFor);

		Assert.Equal(TicketStatus.Scheduled, ticket.Status);
		Assert.Equal("Alex Torres", ticket.Technician);
		Assert.Equal(scheduledFor, ticket.ScheduledFor); 
	}

	[Fact]
	public void Complete_ChangesStatusToCompletd()
	{
		var ticket =  CreateTicket();
		ticket.Complete();

		Assert.Equal(TicketStatus.Completed, ticket.Status);
	}

	[Fact]
	public void COnstructor_RejectMissingCustomerName()
	{
		Assert.Throws<ArgumentException>(() =>
			new ServiceTicket(
				"TKT-1001", "", "Install network switch",
				TicketPriority.High));
	}

	private static ServiceTicket CreateTicket()
	{
		return new ServiceTicket(
			"TKT-1001",
			"Carter Dental",
			"Install network switch",
			TicketPriority.High);
	}
}