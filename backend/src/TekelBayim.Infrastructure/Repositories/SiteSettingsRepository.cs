using Microsoft.EntityFrameworkCore;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Domain.Entities;
using TekelBayim.Infrastructure.Data;

namespace TekelBayim.Infrastructure.Repositories;

/// <summary>
/// Site ayarları repository implementasyonu
/// </summary>
public class SiteSettingsRepository : Repository<SiteSettings>, ISiteSettingsRepository
{
    public SiteSettingsRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<SiteSettings?> GetSettingsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<SiteSettings> GetOrCreateSettingsAsync(CancellationToken cancellationToken = default)
    {
        var settings = await _dbSet.FirstOrDefaultAsync(cancellationToken);
        
        if (settings == null)
        {
            settings = new SiteSettings();
            await _dbSet.AddAsync(settings, cancellationToken);
        }

        return settings;
    }
}
