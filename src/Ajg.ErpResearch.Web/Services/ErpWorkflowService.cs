using Ajg.ErpResearch.Core.Customers;
using Ajg.ErpResearch.Core.Proposals;
using Ajg.ErpResearch.Core.ServiceTickets;
using Ajg.ErpResearch.Web.Models;

namespace Ajg.ErpResearch.Web.Services;

public sealed class ErpWorkflowService(IServiceTicketRepository ticketRepository)
{
    private readonly object syncRoot = new();
    private readonly List<Customer> customers = [];
    private readonly List<Proposal> proposals = [];

    public IReadOnlyList<Customer> GetCustomers()
    {
        lock (syncRoot) return customers.OrderBy(x => x.CustomerName).ToArray();
    }

    public IReadOnlyList<Customer> GetActiveCustomers()
    {
        lock (syncRoot) return customers.Where(x => x.Status == CustomerStatus.Active).OrderBy(x => x.CustomerName).ToArray();
    }

    public Customer CreateCustomer(CreateCustomerInput input)
    {
        lock (syncRoot)
        {
            var customer = new Customer($"CUS-{1001 + customers.Count:D4}", input.CustomerName,
                input.ContactName, input.Email, input.Phone);
            customers.Add(customer);
            return customer;
        }
    }

    public void ActivateCustomer(Guid id)
    {
        lock (syncRoot)
        {
            var customer = customers.SingleOrDefault(x => x.Id == id) ?? throw new InvalidOperationException("Customer not found.");
            customer.Activate();
        }
    }

    public IReadOnlyList<Proposal> GetProposals()
    {
        lock (syncRoot) return proposals.OrderBy(x => x.ProposalNumber).ToArray();
    }

    public Proposal CreateProposal(CreateProposalInput input)
    {
        lock (syncRoot)
        {
            var customer = customers.SingleOrDefault(x => x.Id == input.CustomerId) ?? throw new InvalidOperationException("Customer not found.");
            if (customer.Status != CustomerStatus.Active) throw new InvalidOperationException("Only active customers can receive proposals.");
            var proposal = new Proposal($"PRO-{1001 + proposals.Count:D4}", customer.Id, customer.CustomerName,
                input.Title, input.Description, input.EstimatedHours, input.HourlyRate);
            proposals.Add(proposal);
            return proposal;
        }
    }

    public void AcceptProposal(Guid id)
    {
        lock (syncRoot)
        {
            var proposal = proposals.SingleOrDefault(x => x.Id == id) ?? throw new InvalidOperationException("Proposal not found.");
            proposal.Accept();
        }
    }

    public async Task CreateTicketFromProposalAsync(Guid id, TicketPriority priority)
    {
        Proposal proposal;
        lock (syncRoot)
        {
            proposal = proposals.SingleOrDefault(x => x.Id == id) ?? throw new InvalidOperationException("Proposal not found.");
            if (proposal.Status != ProposalStatus.Accepted) throw new InvalidOperationException("Accept the proposal before creating a ticket.");
            if (proposal.ServiceTicketNumber is not null) throw new InvalidOperationException("This proposal already has a ticket.");
        }
        var existing = await ticketRepository.GetAllAsync();
        var number = $"TKT-{1001 + existing.Count:D4}";
        await ticketRepository.AddAsync(new ServiceTicket(number, proposal.CustomerName, proposal.Description, priority));
        lock (syncRoot) proposal.AttachTicket(number);
    }
}
