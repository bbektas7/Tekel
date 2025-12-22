using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Shared.Exceptions;
using TekelBayim.Shared.Helpers;

namespace TekelBayim.Application.Features.Categories.Commands.UpdateCategory;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateCategoryCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(request.Id, cancellationToken);

        if (category is null)
            throw new NotFoundException("Category", request.Id);

        var dto = request.Dto;

        // Parent kategori kontrolü (kendisine parent olamaz)
        if (dto.ParentCategoryId.HasValue)
        {
            if (dto.ParentCategoryId.Value == request.Id)
                throw new BusinessRuleException("Kategori kendisinin alt kategorisi olamaz", "INVALID_PARENT");

            var parent = await _unitOfWork.Categories.GetByIdAsync(dto.ParentCategoryId.Value, cancellationToken);
            if (parent is null)
                throw new NotFoundException("Category", dto.ParentCategoryId.Value);
        }

        // İsim değiştiyse slug'ı güncelle
        if (category.Name != dto.Name)
        {
            var baseSlug = SlugHelper.GenerateSlug(dto.Name);
            var slug = baseSlug;
            var counter = 1;

            while (await _unitOfWork.Categories.SlugExistsAsync(slug, cancellationToken, request.Id))
            {
                slug = $"{baseSlug}-{counter++}";
            }

            category.Slug = slug;
        }

        category.Name = dto.Name;
        category.ParentCategoryId = dto.ParentCategoryId;
        category.SortOrder = dto.SortOrder;
        category.IsActive = dto.IsActive;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<CategoryDto>(category);
    }
}
