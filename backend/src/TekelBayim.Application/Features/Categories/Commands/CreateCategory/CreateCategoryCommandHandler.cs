using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Entities;
using TekelBayim.Shared.Exceptions;
using TekelBayim.Shared.Helpers;

namespace TekelBayim.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateCategoryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        // Parent kategori kontrolü
        if (dto.ParentCategoryId.HasValue)
        {
            var parent = await _unitOfWork.Categories.GetByIdAsync(dto.ParentCategoryId.Value, cancellationToken);
            if (parent is null)
                throw new NotFoundException("Category", dto.ParentCategoryId.Value);
        }

        // Slug üret ve benzersizliği kontrol et
        var baseSlug = SlugHelper.GenerateSlug(dto.Name);
        var slug = baseSlug;
        var counter = 1;

        while (await _unitOfWork.Categories.SlugExistsAsync(slug, cancellationToken))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        var category = new Category
        {
            Name = dto.Name,
            Slug = slug,
            ParentCategoryId = dto.ParentCategoryId,
            SortOrder = dto.SortOrder,
            IsActive = true
        };

        await _unitOfWork.Categories.AddAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<CategoryDto>(category);
    }
}
