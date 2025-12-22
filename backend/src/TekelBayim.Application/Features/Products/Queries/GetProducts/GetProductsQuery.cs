using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Shared.Models;

namespace TekelBayim.Application.Features.Products.Queries.GetProducts;

/// <summary>
/// Ürün listesi sorgusu (filtreleme, sıralama, sayfalama)
/// </summary>
public record GetProductsQuery(
    Guid? CategoryId,
    string? SearchQuery,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? InStock,
    string? Sort,
    int Page = 1,
    int PageSize = 20
) : IRequest<PagedResult<ProductListDto>>;
