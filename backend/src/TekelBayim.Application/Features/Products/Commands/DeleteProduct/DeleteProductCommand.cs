using MediatR;

namespace TekelBayim.Application.Features.Products.Commands.DeleteProduct;

/// <summary>
/// Ürün sil (stok hareketi varsa IsActive=false yapar)
/// </summary>
public record DeleteProductCommand(Guid Id) : IRequest<bool>;
