using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Products.Commands.CreateProduct;

/// <summary>
/// Yeni ürün oluştur
/// </summary>
public record CreateProductCommand(CreateProductDto Dto) : IRequest<ProductDto>;
