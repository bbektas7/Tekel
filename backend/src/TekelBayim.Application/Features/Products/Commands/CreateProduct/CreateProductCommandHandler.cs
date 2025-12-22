using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Entities;
using TekelBayim.Domain.Enums;
using TekelBayim.Shared.Exceptions;

namespace TekelBayim.Application.Features.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        // Kategori kontrolü
        var category = await _unitOfWork.Categories.GetByIdAsync(dto.CategoryId, cancellationToken);

        if (category is null)
            throw new NotFoundException("Category", dto.CategoryId);

        var product = new Product
        {
            CategoryId = dto.CategoryId,
            Name = dto.Name,
            Brand = dto.Brand,
            Volume = dto.Volume,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            IsActive = true
        };

        await _unitOfWork.Products.AddAsync(product, cancellationToken);

        // İlk stok girişini kaydet
        if (dto.StockQuantity > 0)
        {
            var stockMovement = new StockMovement
            {
                ProductId = product.Id,
                QuantityDelta = dto.StockQuantity,
                Reason = StockMovementReason.Restock,
                Note = "İlk stok girişi"
            };
            await _unitOfWork.StockMovements.AddAsync(stockMovement, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Category bilgisini yükle
        product.Category = category;

        return _mapper.Map<ProductDto>(product);
    }
}
