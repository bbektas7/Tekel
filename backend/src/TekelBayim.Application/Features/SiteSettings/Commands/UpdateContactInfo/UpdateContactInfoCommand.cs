using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateContactInfo;

/// <summary>
/// İletişim bilgilerini güncelle
/// </summary>
public record UpdateContactInfoCommand(UpdateContactInfoDto Dto) : IRequest<ContactInfoDto>;
