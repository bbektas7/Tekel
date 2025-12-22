using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateRegions;

/// <summary>
/// Bölgeleri güncelle (mevcut tüm bölgeleri silip yenilerini ekler)
/// </summary>
public record UpdateRegionsCommand(UpdateRegionsDto Dto) : IRequest<List<RegionDto>>;
