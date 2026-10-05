using System.ComponentModel.DataAnnotations;

namespace Ajg.ErpResearch.Web.Models;

public sealed class ScheduleTicketInput
{
    public Guid TicketId { get; set; }

[Required]
    [StringLength(100)]
    public string Technician { get; set; } = "";

    [Required]
    public DateTime ScheduledFor { get; set; } =
         DateTime.Now.AddDays(1);
}