using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Queries.GetSiteSettings;

namespace TekelBayim.Api.Endpoints.Admin.SiteSettings;

public class GetAdminSiteSettingsEndpoint : EndpointWithoutRequest<SiteSettingsResponseDto>
{
    private readonly IMediator _mediator;

    public GetAdminSiteSettingsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("admin/site-settings");
        Roles("Admin", "Manager");
        Tags("Admin - Site Settings");
        Summary(s =>
        {
            s.Summary = "Tüm site ayarlarını getirir (Admin)";
            s.Description = "Hero slides, about info, regions ve contact info bilgilerini döner";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetSiteSettingsQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
