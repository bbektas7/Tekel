using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateHeroSlides;

public class UpdateHeroSlidesCommandHandler : IRequestHandler<UpdateHeroSlidesCommand, List<HeroSlideDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateHeroSlidesCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<HeroSlideDto>> Handle(UpdateHeroSlidesCommand request, CancellationToken cancellationToken)
    {
        // Mevcut tüm slide'ları sil
        await _unitOfWork.HeroSlides.DeleteAllAsync(cancellationToken);

        // Yeni slide'ları ekle
        var newSlides = request.Dto.Slides.Select(s => new HeroSlide
        {
            ImageUrl = s.ImageUrl,
            Title = s.Title,
            Subtitle = s.Subtitle,
            SortOrder = s.SortOrder,
            IsActive = s.IsActive
        }).ToList();

        foreach (var slide in newSlides)
        {
            await _unitOfWork.HeroSlides.AddAsync(slide, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<List<HeroSlideDto>>(newSlides);
    }
}
