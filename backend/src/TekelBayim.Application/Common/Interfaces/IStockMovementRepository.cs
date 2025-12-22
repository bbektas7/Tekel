using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Stok hareketi repository interface
/// </summary>
public interface IStockMovementRepository : IRepository<StockMovement>
{
    IQueryable<StockMovement> QueryWithProduct();
    Task<int> CountAfterDateAsync(DateTime date, CancellationToken cancellationToken = default);
}
