using System.Security.Claims;
using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Stock.Commands.AdjustStock;

namespace TekelBayim.Api.Endpoints.Admin.Stock;

public class AdjustStockEndpoint : Endpoint<AdjustStockRequest, ProductDto>
{
    private readonly IMediator _mediator;
    private readonly ILogger<AdjustStockEndpoint> _logger;

    public AdjustStockEndpoint(IMediator mediator, ILogger<AdjustStockEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Patch("admin/products/{id}/stock");
        Roles("Admin", "Manager");
        Tags("Admin - Stock");
        Summary(s =>
        {
            s.Summary = "Ürün stoğunu ayarlar";
        });
    }

    public override async Task HandleAsync(AdjustStockRequest req, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userGuid = !string.IsNullOrEmpty(userId) ? Guid.Parse(userId) : (Guid?)null;

        var stockRequest = new StockAdjustmentRequest(req.QuantityDelta, req.Reason, req.Note);

        var result = await _mediator.Send(new AdjustStockCommand(req.Id, stockRequest, userGuid), ct);
        _logger.LogInformation("Stock adjusted for product {ProductId}: {Delta} ({Reason})",
            req.Id, req.QuantityDelta, req.Reason);
        await SendOkAsync(result, ct);
    }
}
