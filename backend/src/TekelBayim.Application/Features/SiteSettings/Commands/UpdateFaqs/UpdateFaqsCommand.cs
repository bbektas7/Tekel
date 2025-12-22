using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.SiteSettings.Commands.UpdateFaqs;

/// <summary>
/// FAQ'ları güncelle (mevcut tüm FAQ'ları silip yenilerini ekler)
/// </summary>
public record UpdateFaqsCommand(UpdateFaqsDto Dto) : IRequest<List<FaqItemDto>>;
