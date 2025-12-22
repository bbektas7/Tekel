using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateFaqs;

public class UpdateFaqsCommandHandler : IRequestHandler<UpdateFaqsCommand, List<FaqItemDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateFaqsCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<FaqItemDto>> Handle(UpdateFaqsCommand request, CancellationToken cancellationToken)
    {
        // Mevcut tüm FAQ'ları sil
        await _unitOfWork.FaqItems.DeleteAllAsync(cancellationToken);

        // Yeni FAQ'ları ekle
        var newFaqs = request.Dto.Faqs.Select(f => new FaqItem
        {
            Question = f.Question,
            Answer = f.Answer,
            SortOrder = f.SortOrder,
            IsActive = f.IsActive
        }).ToList();

        foreach (var faq in newFaqs)
        {
            await _unitOfWork.FaqItems.AddAsync(faq, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<List<FaqItemDto>>(newFaqs);
    }
}
