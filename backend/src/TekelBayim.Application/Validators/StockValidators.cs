using FluentValidation;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Enums;

namespace TekelBayim.Application.Validators;

public class StockAdjustmentRequestValidator : AbstractValidator<StockAdjustmentRequest>
{
    public StockAdjustmentRequestValidator()
    {
        RuleFor(x => x.QuantityDelta)
            .NotEqual(0).WithMessage("Miktar değişimi 0 olamaz");

        RuleFor(x => x.Reason)
            .IsInEnum().WithMessage("Geçersiz stok hareket nedeni");

        RuleFor(x => x.Note)
            .MaximumLength(500).WithMessage("Not en fazla 500 karakter olabilir");
    }
}
