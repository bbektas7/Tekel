using System.Text.Json;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetAboutInfo;

public class GetAboutInfoQueryHandler : IRequestHandler<GetAboutInfoQuery, AboutInfoDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAboutInfoQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AboutInfoDto> Handle(GetAboutInfoQuery request, CancellationToken cancellationToken)
    {
        var siteSettings = await _unitOfWork.SiteSettings.GetSettingsAsync(cancellationToken);

        if (siteSettings == null)
        {
            return new AboutInfoDto("", "", new List<AboutFeatureDto>());
        }

        var features = JsonSerializer.Deserialize<List<AboutFeatureDto>>(siteSettings.AboutFeaturesJson) ?? new();

        return new AboutInfoDto(
            siteSettings.AboutTitle,
            siteSettings.AboutDescription,
            features
        );
    }
}
