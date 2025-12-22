using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetAboutInfo;

/// <summary>
/// Hakkında bilgilerini getir
/// </summary>
public record GetAboutInfoQuery : IRequest<AboutInfoDto>;
