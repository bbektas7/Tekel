using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetContactInfo;

/// <summary>
/// İletişim bilgilerini getir
/// </summary>
public record GetContactInfoQuery : IRequest<ContactInfoDto>;
