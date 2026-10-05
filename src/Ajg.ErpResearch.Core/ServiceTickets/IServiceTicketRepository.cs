namespace Ajg.ErpResearch.Core.ServiceTickets;

public interface IServiceTicketRepository
{
    Task<IReadOnlyList<ServiceTicket>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<ServiceTicket?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        ServiceTicket ticket,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
            ServiceTicket ticket,
            CancellationToken cancellationToken = default
        );

}