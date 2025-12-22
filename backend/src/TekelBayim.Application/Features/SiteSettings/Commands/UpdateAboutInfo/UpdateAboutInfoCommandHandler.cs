using System.Text.Json;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateAboutInfo;

public class UpdateAboutInfoCommandHandler : IRequestHandler<UpdateAboutInfoCommand, AboutInfoDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateAboutInfoCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AboutInfoDto> Handle(UpdateAboutInfoCommand request, CancellationToken cancellationToken)
    {
        var siteSettings = await _unitOfWork.SiteSettings.GetOrCreateSettingsAsync(cancellationToken);

        siteSettings.AboutTitle = request.Dto.AboutTitle;
        siteSettings.AboutDescription = request.Dto.AboutDescription;
        siteSettings.AboutFeaturesJson = JsonSerializer.Serialize(request.Dto.Features);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AboutInfoDto(
            siteSettings.AboutTitle,
            siteSettings.AboutDescription,
            request.Dto.Features
        );
    }
}
