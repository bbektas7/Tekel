using MediatR;

namespace TekelBayim.Application.Features.Categories.Commands.DeleteCategory;

/// <summary>
/// Kategori sil (ilişkili ürün varsa IsActive=false yapar)
/// </summary>
public record DeleteCategoryCommand(Guid Id) : IRequest<bool>;
