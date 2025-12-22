using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Uygulama DbContext interface'i - Clean Architecture için soyutlama
/// </summary>
public interface IAppDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<StockMovement> StockMovements { get; }
    DbSet<HeroSlide> HeroSlides { get; }
    DbSet<Region> Regions { get; }
    DbSet<SiteSettings> SiteSettings { get; }
    
    EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
