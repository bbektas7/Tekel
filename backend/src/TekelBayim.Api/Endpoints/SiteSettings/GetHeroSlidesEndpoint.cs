using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Queries.GetHeroSlides;

namespace TekelBayim.Api.Endpoints.SiteSettings;

public class GetHeroSlidesEndpoint : EndpointWithoutRequest<List<HeroSlideDto>>
{
    private readonly IMediator _mediator;

    public GetHeroSlidesEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("site-settings/hero-slides");
        AllowAnonymous();
        Tags("Site Settings");
        Summary(s =>
        {
            s.Summary = "Aktif hero slide'ları listeler";
            s.Description = "SortOrder'a göre sıralı aktif hero slide'ları döner";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetHeroSlidesQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
