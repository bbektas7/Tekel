using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateRegions;

public class UpdateRegionsCommandHandler : IRequestHandler<UpdateRegionsCommand, List<RegionDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateRegionsCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<RegionDto>> Handle(UpdateRegionsCommand request, CancellationToken cancellationToken)
    {
        // Mevcut tüm bölgeleri sil
        await _unitOfWork.Regions.DeleteAllAsync(cancellationToken);

        // Yeni bölgeleri ekle
        var newRegions = request.Dto.Regions.Select(r => new Region
        {
            Name = r.Name,
            SortOrder = r.SortOrder,
            IsActive = r.IsActive
        }).ToList();

        foreach (var region in newRegions)
        {
            await _unitOfWork.Regions.AddAsync(region, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<List<RegionDto>>(newRegions);
    }
}
