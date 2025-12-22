using TekelBayim.Domain.Enums;

namespace TekelBayim.Application.DTOs;

/// <summary>
/// Stok ayarlama isteği
/// </summary>
public record StockAdjustmentRequest(
    int QuantityDelta,
    StockMovementReason Reason,
    string? Note
);

/// <summary>
/// Stok hareketi görüntüleme DTO
/// </summary>
public record StockMovementDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    int QuantityDelta,
    string Reason,
    string? Note,
    DateTime CreatedAt,
    Guid? CreatedByUserId
);
