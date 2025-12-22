using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateHeroSlides;

/// <summary>
/// Hero slide'ları güncelle (mevcut tüm slide'ları silip yenilerini ekler)
/// </summary>
public record UpdateHeroSlidesCommand(UpdateHeroSlidesDto Dto) : IRequest<List<HeroSlideDto>>;
