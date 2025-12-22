using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Hero slide repository interface
/// </summary>
public interface IHeroSlideRepository : IRepository<HeroSlide>
{
    Task<List<HeroSlide>> GetOrderedSlidesAsync(CancellationToken cancellationToken = default);
    Task<List<HeroSlide>> GetActiveSlidesAsync(CancellationToken cancellationToken = default);
    Task DeleteAllAsync(CancellationToken cancellationToken = default);
}
