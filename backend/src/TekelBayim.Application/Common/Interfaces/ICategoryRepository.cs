using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Kategori repository interface
/// </summary>
public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, CancellationToken cancellationToken = default, Guid? excludeId = null);
    Task<List<Category>> GetActiveCategoriesAsync(CancellationToken cancellationToken = default);
    Task<Category?> GetWithProductsAsync(Guid id, CancellationToken cancellationToken = default);
}
