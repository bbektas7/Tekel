using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Queries.GetFaqs;

public class GetFaqsQueryHandler : IRequestHandler<GetFaqsQuery, List<FaqItemDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetFaqsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<FaqItemDto>> Handle(GetFaqsQuery request, CancellationToken cancellationToken)
    {
        var faqs = await _unitOfWork.FaqItems.GetActiveFaqsAsync(cancellationToken);

        return _mapper.Map<List<FaqItemDto>>(faqs);
    }
}
