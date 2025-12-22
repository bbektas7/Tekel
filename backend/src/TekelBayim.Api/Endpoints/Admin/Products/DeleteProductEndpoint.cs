using FastEndpoints;
using MediatR;
using TekelBayim.Application.Features.Products.Commands.DeleteProduct;

namespace TekelBayim.Api.Endpoints.Admin.Products;

public class DeleteProductEndpoint : Endpoint<DeleteProductRequest>
{
    private readonly IMediator _mediator;
    private readonly ILogger<DeleteProductEndpoint> _logger;

    public DeleteProductEndpoint(IMediator mediator, ILogger<DeleteProductEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Delete("admin/products/{id}");
        Roles("Admin", "Manager");
        Tags("Admin - Products");
        Summary(s =>
        {
            s.Summary = "Ürün siler (stok hareketleri varsa pasif yapar)";
        });
    }

    public override async Task HandleAsync(DeleteProductRequest req, CancellationToken ct)
    {
        await _mediator.Send(new DeleteProductCommand(req.Id), ct);
        _logger.LogInformation("Product deleted: {ProductId}", req.Id);
        await SendNoContentAsync(ct);
    }
}
