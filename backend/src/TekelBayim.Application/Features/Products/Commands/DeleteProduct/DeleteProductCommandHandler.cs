using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Shared.Exceptions;

namespace TekelBayim.Application.Features.Products.Commands.DeleteProduct;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProductCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetWithStockMovementsAsync(request.Id, cancellationToken);

        if (product is null)
            throw new NotFoundException("Product", request.Id);

        // Stok hareketi varsa soft delete yap (veri kaybı olmasın)
        if (product.StockMovements.Any())
        {
            product.IsActive = false;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        // Aksi halde hard delete
        await _unitOfWork.Products.DeleteAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
