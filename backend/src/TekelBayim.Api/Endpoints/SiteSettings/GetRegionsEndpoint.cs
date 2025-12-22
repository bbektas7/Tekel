using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Queries.GetRegions;

namespace TekelBayim.Api.Endpoints.SiteSettings;

public class GetRegionsEndpoint : EndpointWithoutRequest<List<RegionDto>>
{
    private readonly IMediator _mediator;

    public GetRegionsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("site-settings/regions");
        AllowAnonymous();
        Tags("Site Settings");
        Summary(s =>
        {
            s.Summary = "Aktif teslimat bölgelerini listeler";
            s.Description = "SortOrder'a göre sıralı aktif bölgeleri döner";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetRegionsQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
