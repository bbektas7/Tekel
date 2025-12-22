using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateAboutInfo;

/// <summary>
/// Hakkında bilgilerini güncelle
/// </summary>
public record UpdateAboutInfoCommand(UpdateAboutInfoDto Dto) : IRequest<AboutInfoDto>;
