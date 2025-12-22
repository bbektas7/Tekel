using Microsoft.EntityFrameworkCore.Storage;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Infrastructure.Data;

namespace TekelBayim.Infrastructure.Repositories;

/// <summary>
/// Unit of Work implementasyonu - Transaction yönetimi
/// </summary>
public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    private ICategoryRepository? _categories;
    private IProductRepository? _products;
    private IStockMovementRepository? _stockMovements;
    private ISiteSettingsRepository? _siteSettings;
    private IHeroSlideRepository? _heroSlides;
    private IRegionRepository? _regions;
    private IFaqItemRepository? _faqItems;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public ICategoryRepository Categories => _categories ??= new CategoryRepository(_context);
    public IProductRepository Products => _products ??= new ProductRepository(_context);
    public IStockMovementRepository StockMovements => _stockMovements ??= new StockMovementRepository(_context);
    public ISiteSettingsRepository SiteSettings => _siteSettings ??= new SiteSettingsRepository(_context);
    public IHeroSlideRepository HeroSlides => _heroSlides ??= new HeroSlideRepository(_context);
    public IRegionRepository Regions => _regions ??= new RegionRepository(_context);
    public IFaqItemRepository FaqItems => _faqItems ??= new FaqItemRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
