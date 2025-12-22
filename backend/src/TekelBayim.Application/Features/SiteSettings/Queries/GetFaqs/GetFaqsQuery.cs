using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetFaqs;

/// <summary>
/// Aktif FAQ'ları getir
/// </summary>
public record GetFaqsQuery : IRequest<List<FaqItemDto>>;
