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

        // İlişkili ürün varsa silme işlemini engelle
        if (category.Products.Any())
            throw new BusinessRuleException("Bu kategoriye bağlı ürünler bulunmaktadır. Önce ürünleri silmeniz veya başka bir kategoriye taşımanız gerekmektedir.");

        // Alt kategori varsa silme işlemini engelle
        if (category.SubCategories.Any())
            throw new BusinessRuleException("Bu kategoriye bağlı alt kategoriler bulunmaktadır. Önce alt kategorileri silmeniz gerekmektedir.");

        await _unitOfWork.Categories.DeleteAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
