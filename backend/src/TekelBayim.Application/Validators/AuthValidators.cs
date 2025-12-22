using FluentValidation;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta adresi boş olamaz")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre boş olamaz");
    }
}

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta adresi boş olamaz")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre boş olamaz")
            .MinimumLength(8).WithMessage("Şifre en az 8 karakter olmalı")
            .Matches("[A-Z]").WithMessage("Şifre en az bir büyük harf içermeli")
            .Matches("[a-z]").WithMessage("Şifre en az bir küçük harf içermeli")
            .Matches("[0-9]").WithMessage("Şifre en az bir rakam içermeli")
            .Matches("[^a-zA-Z0-9]").WithMessage("Şifre en az bir özel karakter içermeli");

        RuleFor(x => x.DisplayName)
            .MaximumLength(100).WithMessage("Görünen ad en fazla 100 karakter olabilir");

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Telefon numarası en fazla 20 karakter olabilir");
    }
}
