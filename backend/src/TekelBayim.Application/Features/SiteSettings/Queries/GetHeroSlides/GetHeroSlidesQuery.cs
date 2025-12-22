using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetHeroSlides;

/// <summary>
/// Aktif hero slide'ları getir
/// </summary>
public record GetHeroSlidesQuery : IRequest<List<HeroSlideDto>>;
