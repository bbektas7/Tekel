using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetSiteSettings;

/// <summary>
/// Tüm site ayarlarını getir
/// </summary>
public record GetSiteSettingsQuery : IRequest<SiteSettingsResponseDto>;
