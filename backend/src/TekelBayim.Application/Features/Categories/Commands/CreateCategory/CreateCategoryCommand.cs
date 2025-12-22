using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Categories.Commands.CreateCategory;

/// <summary>
/// Yeni kategori oluştur
/// </summary>
public record CreateCategoryCommand(CreateCategoryDto Dto) : IRequest<CategoryDto>;
