using System.ComponentModel.DataAnnotations;
using Ajg.ErpResearch.Core.ServiceTickets;

namespace Ajg.ErpResearch.Web.Models;

public sealed class CreateTicketInput
{
    [Required]
    [StringLength(150)]
    public string CustomerName { get; set; } = "";

    [Required]
    [StringLength(500)]
    public string Description { get; set; } = "";

    public TicketPriority Priority { get; set; } =
         TicketPriority.Medium;
}