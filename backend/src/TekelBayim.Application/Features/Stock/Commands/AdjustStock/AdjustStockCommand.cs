using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Stock.Commands.AdjustStock;

/// <summary>
/// Stok miktarını ayarla
/// </summary>
public record AdjustStockCommand(Guid ProductId, StockAdjustmentRequest Request, Guid? UserId) : IRequest<ProductDto>;
