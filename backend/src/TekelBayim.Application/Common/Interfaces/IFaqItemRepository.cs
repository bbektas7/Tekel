using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// FAQ item repository interface
/// </summary>
public interface IFaqItemRepository : IRepository<FaqItem>
{
    Task<List<FaqItem>> GetOrderedFaqsAsync(CancellationToken cancellationToken = default);
    Task<List<FaqItem>> GetActiveFaqsAsync(CancellationToken cancellationToken = default);
    Task DeleteAllAsync(CancellationToken cancellationToken = default);
}
