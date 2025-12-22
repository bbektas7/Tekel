using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Products.Queries.GetProductById;

/// <summary>
/// Tek ürün detayı
/// </summary>
public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto>;
