using MediatR;
using Microsoft.EntityFrameworkCore;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Dashboard.Queries.GetDashboardSummary;

public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private const int LowStockThreshold = 5;

    public GetDashboardSummaryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var totalProducts = await _unitOfWork.Products.Query()
            .CountAsync(p => p.IsActive, cancellationToken);

        var totalCategories = await _unitOfWork.Categories.Query()
            .CountAsync(c => c.IsActive, cancellationToken);

        var lowStockCount = await _unitOfWork.Products.Query()
            .CountAsync(p => p.IsActive && p.StockQuantity > 0 && p.StockQuantity <= LowStockThreshold, cancellationToken);

        var outOfStockCount = await _unitOfWork.Products.Query()
            .CountAsync(p => p.IsActive && p.StockQuantity == 0, cancellationToken);

        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);
        var last7DaysStockMovementsCount = await _unitOfWork.StockMovements.CountAfterDateAsync(sevenDaysAgo, cancellationToken);

        return new DashboardSummaryDto(
            totalProducts,
            totalCategories,
            lowStockCount,
            outOfStockCount,
            last7DaysStockMovementsCount
        );
    }
}
