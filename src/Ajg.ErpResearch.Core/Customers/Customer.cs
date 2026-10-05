namespace Ajg.ErpResearch.Core.Customers;

public sealed class Customer
{
    public Guid Id { get; } = Guid.NewGuid();
    public string CustomerNumber { get; }
    public string CustomerName { get; }
    public string? ContactName { get; }
    public string? Email { get; }
    public string? Phone { get; }
    public CustomerStatus Status { get; private set; } = CustomerStatus.Pending;

    public Customer(string customerNumber, string customerName, string? contactName, string? email, string? phone)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(customerNumber);
        ArgumentException.ThrowIfNullOrWhiteSpace(customerName);
        CustomerNumber = customerNumber.Trim();
        CustomerName = customerName.Trim();
        ContactName = Clean(contactName);
        Email = Clean(email);
        Phone = Clean(phone);
    }

    public void Activate() => Status = CustomerStatus.Active;
    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
