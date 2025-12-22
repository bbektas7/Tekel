using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Products.Commands.UpdateProduct;

namespace TekelBayim.Api.Endpoints.Admin.Products;

public class UpdateProductEndpoint : Endpoint<UpdateProductRequest, ProductDto>
{
    private readonly IMediator _mediator;
    private readonly ILogger<UpdateProductEndpoint> _logger;

    public UpdateProductEndpoint(IMediator mediator, ILogger<UpdateProductEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Put("admin/products/{id}");
        Roles("Admin", "Manager");
        Tags("Admin - Products");
        Summary(s =>
        {
            s.Summary = "Ürün günceller";
        });
    }

    public override async Task HandleAsync(UpdateProductRequest req, CancellationToken ct)
    {
        var dto = new UpdateProductDto(req.CategoryId, req.Name, req.Brand, req.Volume, req.Price, req.Description, req.ImageUrl, req.IsActive);
        var result = await _mediator.Send(new UpdateProductCommand(req.Id, dto), ct);
        _logger.LogInformation("Product updated: {ProductId}", req.Id);
        await SendOkAsync(result, ct);
    }
}
