using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetHeroSlides;

public class GetHeroSlidesQueryHandler : IRequestHandler<GetHeroSlidesQuery, List<HeroSlideDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetHeroSlidesQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<HeroSlideDto>> Handle(GetHeroSlidesQuery request, CancellationToken cancellationToken)
    {
        var heroSlides = await _unitOfWork.HeroSlides.GetActiveSlidesAsync(cancellationToken);

        return _mapper.Map<List<HeroSlideDto>>(heroSlides);
    }
}
