using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Queries.GetSiteSettings;

namespace TekelBayim.Api.Endpoints.SiteSettings;

public class GetSiteSettingsEndpoint : EndpointWithoutRequest<SiteSettingsResponseDto>
{
    private readonly IMediator _mediator;

    public GetSiteSettingsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("site-settings");
        AllowAnonymous();
        Tags("Site Settings");
        Summary(s =>
        {
            s.Summary = "Tüm site ayarlarını getirir";
            s.Description = "Hero slides, about info, regions ve contact info bilgilerini döner";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetSiteSettingsQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
