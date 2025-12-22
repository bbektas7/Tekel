using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Categories.Queries.GetCategories;

/// <summary>
/// Tüm aktif kategorileri listele
/// </summary>
public record GetCategoriesQuery : IRequest<List<CategoryDto>>;
