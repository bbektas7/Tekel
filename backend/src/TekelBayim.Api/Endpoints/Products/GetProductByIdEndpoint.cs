using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Products.Queries.GetProductById;

namespace TekelBayim.Api.Endpoints.Products;

public class GetProductByIdEndpoint : Endpoint<GetProductByIdRequest, ProductDto>
{
    private readonly IMediator _mediator;

    public GetProductByIdEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("products/{id}");
        AllowAnonymous();
        Tags("Products");
        Summary(s =>
        {
            s.Summary = "Tek bir ürünün detaylarını getirir";
        });
    }

    public override async Task HandleAsync(GetProductByIdRequest req, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(req.Id), ct);
        await SendOkAsync(result, ct);
    }
}
