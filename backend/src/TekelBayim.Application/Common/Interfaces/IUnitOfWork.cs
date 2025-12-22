namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Unit of Work pattern - Transaction yönetimi için
/// </summary>
public interface IUnitOfWork
{
    ICategoryRepository Categories { get; }
    IProductRepository Products { get; }
    IStockMovementRepository StockMovements { get; }
    ISiteSettingsRepository SiteSettings { get; }
    IHeroSlideRepository HeroSlides { get; }
    IRegionRepository Regions { get; }
    IFaqItemRepository FaqItems { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
