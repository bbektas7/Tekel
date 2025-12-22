using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Categories.Queries.GetCategories;

namespace TekelBayim.Api.Endpoints.Categories;

public class GetCategoriesEndpoint : EndpointWithoutRequest<List<CategoryDto>>
{
    private readonly IMediator _mediator;

    public GetCategoriesEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("categories");
        AllowAnonymous();
        Tags("Categories");
        Summary(s =>
        {
            s.Summary = "Tüm aktif kategorileri listeler";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetCategoriesQuery(), ct);
        await SendOkAsync(result, ct);
    }
}
