using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Shared.Exceptions;

namespace TekelBayim.Application.Features.Categories.Commands.DeleteCategory;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCategoryCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetWithProductsAsync(request.Id, cancellationToken);

        if (category is null)
            throw new NotFoundException("Category", request.Id);

        // İlişkili ürün veya alt kategori varsa soft delete yap
        if (category.Products.Any() || category.SubCategories.Any())
        {
            category.IsActive = false;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        // Aksi halde hard delete
        await _unitOfWork.Categories.DeleteAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
