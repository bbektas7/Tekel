using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Commands.UpdateContactInfo;

namespace TekelBayim.Api.Endpoints.Admin.SiteSettings;

public class UpdateContactInfoEndpoint : Endpoint<UpdateContactInfoDto, ContactInfoDto>
{
    private readonly IMediator _mediator;
    private readonly ILogger<UpdateContactInfoEndpoint> _logger;

    public UpdateContactInfoEndpoint(IMediator mediator, ILogger<UpdateContactInfoEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Put("admin/site-settings/contact");
        Roles("Admin", "Manager");
        Tags("Admin - Site Settings");
        Summary(s =>
        {
            s.Summary = "İletişim bilgilerini günceller";
            s.Description = "Telefon, WhatsApp, e-posta, adres ve sosyal medya bilgilerini günceller";
        });
    }

    public override async Task HandleAsync(UpdateContactInfoDto req, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateContactInfoCommand(req), ct);
        _logger.LogInformation("Contact info updated. Phone: {Phone}", result.Phone);
        await SendOkAsync(result, ct);
    }
}
