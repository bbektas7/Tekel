using Microsoft.EntityFrameworkCore;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Domain.Entities;
using TekelBayim.Infrastructure.Data;

namespace TekelBayim.Infrastructure.Repositories;

/// <summary>
/// FAQ item repository implementasyonu
/// </summary>
public class FaqItemRepository : Repository<FaqItem>, IFaqItemRepository
{
    public FaqItemRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<FaqItem>> GetOrderedFaqsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .OrderBy(f => f.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<List<FaqItem>> GetActiveFaqsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(f => f.IsActive)
            .OrderBy(f => f.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteAllAsync(CancellationToken cancellationToken = default)
    {
        var allFaqs = await _dbSet.ToListAsync(cancellationToken);
        _dbSet.RemoveRange(allFaqs);
    }
}
