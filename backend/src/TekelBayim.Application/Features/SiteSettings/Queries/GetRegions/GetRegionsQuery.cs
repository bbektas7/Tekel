using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetRegions;

/// <summary>
/// Aktif bölgeleri getir
/// </summary>
public record GetRegionsQuery : IRequest<List<RegionDto>>;
