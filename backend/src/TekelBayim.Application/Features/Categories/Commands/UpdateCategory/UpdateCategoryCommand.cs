using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Categories.Commands.UpdateCategory;

/// <summary>
/// Kategori güncelle
/// </summary>
public record UpdateCategoryCommand(Guid Id, UpdateCategoryDto Dto) : IRequest<CategoryDto>;
