using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateContactInfo;

public class UpdateContactInfoCommandHandler : IRequestHandler<UpdateContactInfoCommand, ContactInfoDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateContactInfoCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ContactInfoDto> Handle(UpdateContactInfoCommand request, CancellationToken cancellationToken)
    {
        var siteSettings = await _unitOfWork.SiteSettings.GetOrCreateSettingsAsync(cancellationToken);

        siteSettings.Phone = request.Dto.Phone;
        siteSettings.Whatsapp = request.Dto.Whatsapp;
        siteSettings.Email = request.Dto.Email;
        siteSettings.Address = request.Dto.Address;
        siteSettings.City = request.Dto.City;
        siteSettings.Country = request.Dto.Country;
        siteSettings.InstagramUrl = request.Dto.InstagramUrl;
        siteSettings.FacebookUrl = request.Dto.FacebookUrl;
        siteSettings.TwitterUrl = request.Dto.TwitterUrl;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

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
