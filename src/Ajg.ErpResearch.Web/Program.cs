using Ajg.ErpResearch.Web.Components;
using Ajg.ErpResearch.Core.ServiceTickets;
using Ajg.ErpResearch.Infrastructure.ServiceTickets;
using Ajg.ErpResearch.Web.Services;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseStaticWebAssets();

builder.Services
    .AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton<
    IServiceTicketRepository,
    InMemoryServiceTicketRepository>();
builder.Services.AddSingleton<ErpWorkflowService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
