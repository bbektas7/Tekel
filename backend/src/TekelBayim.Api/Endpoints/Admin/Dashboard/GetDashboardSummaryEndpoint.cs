using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Dashboard.Queries.GetDashboardSummary;

namespace TekelBayim.Api.Endpoints.Admin.Dashboard;

public class GetDashboardSummaryEndpoint : EndpointWithoutRequest<DashboardSummaryDto>
{
    private readonly IMediator _mediator;

    public GetDashboardSummaryEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("admin/summary");
        Roles("Admin", "Manager");
        Tags("Admin - Dashboard");
        Summary(s =>
        {
            s.Summary = "Dashboard özet bilgilerini getirir";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetDashboardSummaryQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
