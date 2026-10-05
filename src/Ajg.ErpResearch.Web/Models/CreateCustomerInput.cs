using System.ComponentModel.DataAnnotations;

namespace Ajg.ErpResearch.Web.Models;

public sealed class CreateCustomerInput
{
    [Required, StringLength(150)] public string CustomerName { get; set; } = "";
    [StringLength(150)] public string ContactName { get; set; } = "";
    [EmailAddress, StringLength(200)] public string Email { get; set; } = "";
    [Phone, StringLength(50)] public string Phone { get; set; } = "";
}
