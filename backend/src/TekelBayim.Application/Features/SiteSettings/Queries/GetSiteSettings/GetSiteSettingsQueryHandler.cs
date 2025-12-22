using System.Text.Json;
using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetSiteSettings;

public class GetSiteSettingsQueryHandler : IRequestHandler<GetSiteSettingsQuery, SiteSettingsResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetSiteSettingsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<SiteSettingsResponseDto> Handle(GetSiteSettingsQuery request, CancellationToken cancellationToken)
    {
        // Hero slides
        var heroSlides = await _unitOfWork.HeroSlides.GetOrderedSlidesAsync(cancellationToken);
        var heroSlideDtos = _mapper.Map<List<HeroSlideDto>>(heroSlides);

        // Regions
        var regions = await _unitOfWork.Regions.GetActiveRegionsAsync(cancellationToken);
        var regionDtos = _mapper.Map<List<RegionDto>>(regions);

        // FAQ items
        var faqs = await _unitOfWork.FaqItems.GetOrderedFaqsAsync(cancellationToken);
        var faqDtos = _mapper.Map<List<FaqItemDto>>(faqs);

        // Site settings
        var siteSettings = await _unitOfWork.SiteSettings.GetSettingsAsync(cancellationToken);

        AboutInfoDto aboutInfo;
        ContactInfoDto contactInfo;

        if (siteSettings != null)
        {
            var features = JsonSerializer.Deserialize<List<AboutFeatureDto>>(siteSettings.AboutFeaturesJson) ?? new();
            
            aboutInfo = new AboutInfoDto(
                siteSettings.AboutTitle,
                siteSettings.AboutDescription,
                features
            );

            contactInfo = new ContactInfoDto(
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
        else
        {
            aboutInfo = new AboutInfoDto("", "", new List<AboutFeatureDto>());
            contactInfo = new ContactInfoDto("", "", "", "", "", "", null, null, null);
        }

        return new SiteSettingsResponseDto(heroSlideDtos, aboutInfo, regionDtos, contactInfo, faqDtos);
    }
}
