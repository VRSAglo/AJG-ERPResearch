using System.ComponentModel.DataAnnotations;

namespace Ajg.ErpResearch.Web.Models;

public sealed class CreateProposalInput
{
    [Required] public Guid? CustomerId { get; set; }
    [Required, StringLength(150)] public string Title { get; set; } = "";
    [Required, StringLength(1000)] public string Description { get; set; } = "";
    [Range(0.01, 10000)] public decimal EstimatedHours { get; set; } = 1;
    [Range(0, 100000)] public decimal HourlyRate { get; set; } = 100;
}
