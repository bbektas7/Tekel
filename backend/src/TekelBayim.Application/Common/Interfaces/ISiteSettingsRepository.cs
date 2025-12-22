using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Site ayarları repository interface
/// </summary>
public interface ISiteSettingsRepository : IRepository<SiteSettings>
{
    Task<SiteSettings?> GetSettingsAsync(CancellationToken cancellationToken = default);
    Task<SiteSettings> GetOrCreateSettingsAsync(CancellationToken cancellationToken = default);
}
