using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Ürün repository interface
/// </summary>
public interface IProductRepository : IRepository<Product>
{
    Task<Product?> GetWithCategoryAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Product?> GetWithStockMovementsAsync(Guid id, CancellationToken cancellationToken = default);
    IQueryable<Product> QueryWithCategory();
}
