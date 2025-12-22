using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Shared.Models;

namespace TekelBayim.Application.Features.Stock.Queries.GetStockMovements;

/// <summary>
/// Stok hareketlerini listele
/// </summary>
public record GetStockMovementsQuery(
    Guid? ProductId,
    int Page = 1,
    int PageSize = 20
) : IRequest<PagedResult<StockMovementDto>>;
