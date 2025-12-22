using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Commands.UpdateAboutInfo;

namespace TekelBayim.Api.Endpoints.Admin.SiteSettings;

public class UpdateAboutInfoEndpoint : Endpoint<UpdateAboutInfoDto, AboutInfoDto>
{
    private readonly IMediator _mediator;
    private readonly ILogger<UpdateAboutInfoEndpoint> _logger;

    public UpdateAboutInfoEndpoint(IMediator mediator, ILogger<UpdateAboutInfoEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Put("admin/site-settings/about");
        Roles("Admin", "Manager");
        Tags("Admin - Site Settings");
        Summary(s =>
        {
            s.Summary = "Hakkında bilgilerini günceller";
            s.Description = "Site hakkında başlık, açıklama ve özellikler bilgilerini günceller";
        });
    }

    public override async Task HandleAsync(UpdateAboutInfoDto req, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateAboutInfoCommand(req), ct);
        _logger.LogInformation("About info updated. Title: {Title}", result.AboutTitle);
        await SendOkAsync(result, ct);
    }
}
