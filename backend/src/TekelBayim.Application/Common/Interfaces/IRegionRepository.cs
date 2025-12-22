using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Bölge repository interface
/// </summary>
public interface IRegionRepository : IRepository<Region>
{
    Task<List<Region>> GetActiveRegionsAsync(CancellationToken cancellationToken = default);
    Task<List<Region>> GetOrderedRegionsAsync(CancellationToken cancellationToken = default);
    Task DeleteAllAsync(CancellationToken cancellationToken = default);
}
