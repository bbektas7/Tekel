using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Products.Commands.UpdateProduct;

/// <summary>
/// Ürün güncelle
/// </summary>
public record UpdateProductCommand(Guid Id, UpdateProductDto Dto) : IRequest<ProductDto>;
