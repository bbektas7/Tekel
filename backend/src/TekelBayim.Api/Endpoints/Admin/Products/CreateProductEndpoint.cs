using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Products.Commands.CreateProduct;

namespace TekelBayim.Api.Endpoints.Admin.Products;

public class CreateProductEndpoint : Endpoint<CreateProductDto, ProductDto>
{
    private readonly IMediator _mediator;
    private readonly ILogger<CreateProductEndpoint> _logger;

    public CreateProductEndpoint(IMediator mediator, ILogger<CreateProductEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Post("admin/products");
        Roles("Admin", "Manager");
        Tags("Admin - Products");
        Summary(s =>
        {
            s.Summary = "Yeni ürün oluşturur";
        });
    }

    public override async Task HandleAsync(CreateProductDto req, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateProductCommand(req), ct);
        _logger.LogInformation("Product created: {ProductId} - {ProductName}", result.Id, result.Name);
        await SendCreatedAtAsync<Api.Endpoints.Products.GetProductByIdEndpoint>(new { id = result.Id }, result, cancellation: ct);
    }
}
