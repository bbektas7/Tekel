using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Commands.UpdateRegions;

namespace TekelBayim.Api.Endpoints.Admin.SiteSettings;

public class UpdateRegionsEndpoint : Endpoint<UpdateRegionsDto, List<RegionDto>>
{
    private readonly IMediator _mediator;
    private readonly ILogger<UpdateRegionsEndpoint> _logger;

    public UpdateRegionsEndpoint(IMediator mediator, ILogger<UpdateRegionsEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Put("admin/site-settings/regions");
        Roles("Admin", "Manager");
        Tags("Admin - Site Settings");
        Summary(s =>
        {
            s.Summary = "Teslimat bölgelerini günceller";
            s.Description = "Mevcut tüm bölgeleri silip yenilerini ekler";
        });
    }

    public override async Task HandleAsync(UpdateRegionsDto req, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateRegionsCommand(req), ct);
        _logger.LogInformation("Regions updated. Count: {Count}", result.Count);
        await SendOkAsync(result, ct);
    }
}
