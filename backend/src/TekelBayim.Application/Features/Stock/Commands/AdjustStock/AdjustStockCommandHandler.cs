using AutoMapper;
using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Entities;
using TekelBayim.Shared.Exceptions;

namespace TekelBayim.Application.Features.Stock.Commands.AdjustStock;

public class AdjustStockCommandHandler : IRequestHandler<AdjustStockCommand, ProductDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AdjustStockCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductDto> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetWithCategoryAsync(request.ProductId, cancellationToken);

        if (product is null)
            throw new NotFoundException("Product", request.ProductId);

        var newQuantity = product.StockQuantity + request.Request.QuantityDelta;

        if (newQuantity < 0)
            throw new BusinessRuleException(
                $"Stok miktarı negatif olamaz. Mevcut: {product.StockQuantity}, Değişim: {request.Request.QuantityDelta}",
                "NEGATIVE_STOCK");

        // Stok hareketini kaydet
        var stockMovement = new StockMovement
        {
            ProductId = request.ProductId,
            QuantityDelta = request.Request.QuantityDelta,
            Reason = request.Request.Reason,
            Note = request.Request.Note,
            CreatedByUserId = request.UserId
        };

        await _unitOfWork.StockMovements.AddAsync(stockMovement, cancellationToken);

        // Ürün stoğunu güncelle
        product.StockQuantity = newQuantity;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ProductDto>(product);
    }
}
