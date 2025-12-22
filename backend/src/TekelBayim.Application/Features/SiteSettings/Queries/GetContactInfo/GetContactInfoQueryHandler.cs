using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetContactInfo;

public class GetContactInfoQueryHandler : IRequestHandler<GetContactInfoQuery, ContactInfoDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetContactInfoQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ContactInfoDto> Handle(GetContactInfoQuery request, CancellationToken cancellationToken)
    {
        var siteSettings = await _unitOfWork.SiteSettings.GetSettingsAsync(cancellationToken);

        if (siteSettings == null)
        {
            return new ContactInfoDto("", "", "", "", "", "", null, null, null);
        }

        return new ContactInfoDto(
            siteSettings.Phone,
            siteSettings.Whatsapp,
            siteSettings.Email,
            siteSettings.Address,
            siteSettings.City,
            siteSettings.Country,
            siteSettings.InstagramUrl,
            siteSettings.FacebookUrl,
            siteSettings.TwitterUrl
        );
    }
}
