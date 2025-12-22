using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Shared.Exceptions;

namespace TekelBayim.Application.Features.Products.Commands.UpdateProduct;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateProductCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetWithCategoryAsync(request.Id, cancellationToken);

        if (product is null)
            throw new NotFoundException("Product", request.Id);

        var dto = request.Dto;

        // Kategori değiştiyse kontrol et
        if (product.CategoryId != dto.CategoryId)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(dto.CategoryId, cancellationToken);
            if (category is null)
                throw new NotFoundException("Category", dto.CategoryId);

            product.Category = category;
        }

        product.CategoryId = dto.CategoryId;
        product.Name = dto.Name;
        product.Brand = dto.Brand;
        product.Volume = dto.Volume;
        product.Price = dto.Price;
        product.Description = dto.Description;
        product.ImageUrl = dto.ImageUrl;
        product.IsActive = dto.IsActive;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ProductDto>(product);
    }
}
