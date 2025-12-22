using Microsoft.EntityFrameworkCore;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Domain.Entities;
using TekelBayim.Infrastructure.Data;

namespace TekelBayim.Infrastructure.Repositories;

/// <summary>
/// Stok hareketi repository implementasyonu
/// </summary>
public class StockMovementRepository : Repository<StockMovement>, IStockMovementRepository
{
    public StockMovementRepository(AppDbContext context) : base(context)
    {
    }

    public IQueryable<StockMovement> QueryWithProduct()
    {
        return _dbSet.Include(sm => sm.Product);
    }

    public async Task<int> CountAfterDateAsync(DateTime date, CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(sm => sm.CreatedAt >= date, cancellationToken);
    }
}
