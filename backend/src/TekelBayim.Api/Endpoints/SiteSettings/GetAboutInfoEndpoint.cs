using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Queries.GetAboutInfo;

namespace TekelBayim.Api.Endpoints.SiteSettings;

public class GetAboutInfoEndpoint : EndpointWithoutRequest<AboutInfoDto>
{
    private readonly IMediator _mediator;

    public GetAboutInfoEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("site-settings/about");
        AllowAnonymous();
        Tags("Site Settings");
        Summary(s =>
        {
            s.Summary = "Hakkında bilgilerini getirir";
            s.Description = "Site hakkında başlık, açıklama ve özellikler bilgilerini döner";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetAboutInfoQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
