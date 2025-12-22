using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Commands.UpdateHeroSlides;

namespace TekelBayim.Api.Endpoints.Admin.SiteSettings;

public class UpdateHeroSlidesEndpoint : Endpoint<UpdateHeroSlidesDto, List<HeroSlideDto>>
{
    private readonly IMediator _mediator;
    private readonly ILogger<UpdateHeroSlidesEndpoint> _logger;

    public UpdateHeroSlidesEndpoint(IMediator mediator, ILogger<UpdateHeroSlidesEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Put("admin/site-settings/hero-slides");
        Roles("Admin", "Manager");
        Tags("Admin - Site Settings");
        Summary(s =>
        {
            s.Summary = "Hero slide'ları günceller";
            s.Description = "Mevcut tüm slide'ları silip yenilerini ekler";
        });
    }

    public override async Task HandleAsync(UpdateHeroSlidesDto req, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateHeroSlidesCommand(req), ct);
        _logger.LogInformation("Hero slides updated. Count: {Count}", result.Count);
        await SendOkAsync(result, ct);
    }
}
