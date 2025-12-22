namespace TekelBayim.Application.DTOs;

/// <summary>
/// Admin dashboard özet bilgileri
/// </summary>
public record DashboardSummaryDto(
    int TotalProducts,
    int TotalCategories,
    int LowStockCount,
    int OutOfStockCount,
    int Last7DaysStockMovementsCount
);
