using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.SiteSettings.Queries.GetFaqs;

namespace TekelBayim.Api.Endpoints.SiteSettings;

public class GetFaqsEndpoint : EndpointWithoutRequest<List<FaqItemDto>>
{
    private readonly IMediator _mediator;

    public GetFaqsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("site-settings/faqs");
        AllowAnonymous();
        Tags("Site Settings");
        Summary(s =>
        {
            s.Summary = "Aktif FAQ'ları listeler";
            s.Description = "SortOrder'a göre sıralı aktif FAQ'ları döner";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetFaqsQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
