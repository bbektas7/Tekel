using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Queries.GetContactInfo;

namespace TekelBayim.Api.Endpoints.SiteSettings;

public class GetContactInfoEndpoint : EndpointWithoutRequest<ContactInfoDto>
{
    private readonly IMediator _mediator;

    public GetContactInfoEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("site-settings/contact");
        AllowAnonymous();
        Tags("Site Settings");
        Summary(s =>
        {
            s.Summary = "İletişim bilgilerini getirir";
            s.Description = "Telefon, WhatsApp, e-posta, adres ve sosyal medya bilgilerini döner";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetContactInfoQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
