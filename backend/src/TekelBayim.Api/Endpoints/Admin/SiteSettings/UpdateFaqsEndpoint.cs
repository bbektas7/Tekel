using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Commands.UpdateFaqs;

namespace TekelBayim.Api.Endpoints.Admin.SiteSettings;

public class UpdateFaqsEndpoint : Endpoint<UpdateFaqsDto, List<FaqItemDto>>
{
    private readonly IMediator _mediator;
    private readonly ILogger<UpdateFaqsEndpoint> _logger;

    public UpdateFaqsEndpoint(IMediator mediator, ILogger<UpdateFaqsEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Put("admin/site-settings/faqs");
        Roles("Admin", "Manager");
        Tags("Admin - Site Settings");
        Summary(s =>
        {
            s.Summary = "FAQ'ları günceller";
            s.Description = "Mevcut tüm FAQ'ları silip yenilerini ekler";
        });
    }

    public override async Task HandleAsync(UpdateFaqsDto req, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateFaqsCommand(req), ct);
        _logger.LogInformation("FAQs updated. Count: {Count}", result.Count);
        await SendOkAsync(result, ct);
    }
}
