using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Stock.Queries.GetStockMovements;
using TekelBayim.Shared.Models;

namespace TekelBayim.Api.Endpoints.Admin.Stock;

public class GetStockMovementsEndpoint : Endpoint<GetStockMovementsRequest, PagedResult<StockMovementDto>>
{
    private readonly IMediator _mediator;

    public GetStockMovementsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("admin/stock-movements");
        Roles("Admin", "Manager");
        Tags("Admin - Stock");
        Summary(s =>
        {
            s.Summary = "Stok hareketlerini listeler";
        });
    }

    public override async Task HandleAsync(GetStockMovementsRequest req, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetStockMovementsQuery(req.ProductId, req.Page, req.PageSize), ct);
        await SendOkAsync(result, ct);
    }
}
