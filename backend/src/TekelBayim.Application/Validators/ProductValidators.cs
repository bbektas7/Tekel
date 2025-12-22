using FluentValidation;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Validators;

public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Ürün adı boş olamaz")
            .MaximumLength(200).WithMessage("Ürün adı en fazla 200 karakter olabilir");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Kategori seçilmelidir");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Fiyat 0 veya daha büyük olmalı");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stok miktarı 0 veya daha büyük olmalı");

        RuleFor(x => x.Brand)
            .MaximumLength(100).WithMessage("Marka adı en fazla 100 karakter olabilir");

        RuleFor(x => x.Volume)
            .MaximumLength(50).WithMessage("Hacim bilgisi en fazla 50 karakter olabilir");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Açıklama en fazla 1000 karakter olabilir");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("Resim URL'i en fazla 500 karakter olabilir");
    }
}

public class UpdateProductDtoValidator : AbstractValidator<UpdateProductDto>
{
    public UpdateProductDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Ürün adı boş olamaz")
            .MaximumLength(200).WithMessage("Ürün adı en fazla 200 karakter olabilir");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Kategori seçilmelidir");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Fiyat 0 veya daha büyük olmalı");

        RuleFor(x => x.Brand)
            .MaximumLength(100).WithMessage("Marka adı en fazla 100 karakter olabilir");

        RuleFor(x => x.Volume)
            .MaximumLength(50).WithMessage("Hacim bilgisi en fazla 50 karakter olabilir");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Açıklama en fazla 1000 karakter olabilir");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("Resim URL'i en fazla 500 karakter olabilir");
    }
}
