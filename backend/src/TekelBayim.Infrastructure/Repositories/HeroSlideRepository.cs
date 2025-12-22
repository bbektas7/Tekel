using Microsoft.EntityFrameworkCore;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Domain.Entities;
using TekelBayim.Infrastructure.Data;

namespace TekelBayim.Infrastructure.Repositories;

/// <summary>
/// Hero slide repository implementasyonu
/// </summary>
public class HeroSlideRepository : Repository<HeroSlide>, IHeroSlideRepository
{
    public HeroSlideRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<HeroSlide>> GetOrderedSlidesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .OrderBy(h => h.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<List<HeroSlide>> GetActiveSlidesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(h => h.IsActive)
            .OrderBy(h => h.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteAllAsync(CancellationToken cancellationToken = default)
    {
        var allSlides = await _dbSet.ToListAsync(cancellationToken);
        _dbSet.RemoveRange(allSlides);
    }
}
