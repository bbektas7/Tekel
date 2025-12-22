using Microsoft.EntityFrameworkCore;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Domain.Entities;
using TekelBayim.Infrastructure.Data;

namespace TekelBayim.Infrastructure.Repositories;

/// <summary>
/// Bölge repository implementasyonu
/// </summary>
public class RegionRepository : Repository<Region>, IRegionRepository
{
    public RegionRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Region>> GetActiveRegionsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(r => r.IsActive)
            .OrderBy(r => r.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Region>> GetOrderedRegionsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .OrderBy(r => r.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteAllAsync(CancellationToken cancellationToken = default)
    {
        var allRegions = await _dbSet.ToListAsync(cancellationToken);
        _dbSet.RemoveRange(allRegions);
    }
}
