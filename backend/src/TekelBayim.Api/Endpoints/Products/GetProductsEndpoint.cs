using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Products.Queries.GetProducts;
using TekelBayim.Shared.Models;

namespace TekelBayim.Api.Endpoints.Products;

public class GetProductsEndpoint : Endpoint<GetProductsRequest, PagedResult<ProductListDto>>
{
    private readonly IMediator _mediator;

    public GetProductsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("products");
        AllowAnonymous();
        Tags("Products");
        Summary(s =>
        {
            s.Summary = "Ürünleri listeler";
            s.Description = "Ürünleri listeler (filtreleme, sıralama, sayfalama destekler)";
        });
    }

    public override async Task HandleAsync(GetProductsRequest req, CancellationToken ct)
    {
        var query = new GetProductsQuery(
            req.CategoryId,
            req.Q,
            req.MinPrice,
            req.MaxPrice,
            req.InStock,
            req.Sort,
            req.Page,
            req.PageSize);

        var result = await _mediator.Send(query, ct);
        await SendOkAsync(result, ct);
    }
}
