using FluentValidation;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Validators;

public class CreateHeroSlideDtoValidator : AbstractValidator<CreateHeroSlideDto>
{
    public CreateHeroSlideDtoValidator()
    {
        RuleFor(x => x.ImageUrl)
            .NotEmpty().WithMessage("Görsel URL'si boş olamaz")
            .MaximumLength(500).WithMessage("Görsel URL'si en fazla 500 karakter olabilir");

        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Başlık en fazla 200 karakter olabilir");

        RuleFor(x => x.Subtitle)
            .MaximumLength(300).WithMessage("Alt başlık en fazla 300 karakter olabilir");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sıralama değeri 0 veya daha büyük olmalı");
    }
}

public class UpdateHeroSlidesDtoValidator : AbstractValidator<UpdateHeroSlidesDto>
{
    public UpdateHeroSlidesDtoValidator()
    {
        RuleForEach(x => x.Slides)
            .SetValidator(new CreateHeroSlideDtoValidator());
    }
}

public class CreateRegionDtoValidator : AbstractValidator<CreateRegionDto>
{
    public CreateRegionDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Bölge adı boş olamaz")
            .MaximumLength(100).WithMessage("Bölge adı en fazla 100 karakter olabilir");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sıralama değeri 0 veya daha büyük olmalı");
    }
}

public class UpdateRegionsDtoValidator : AbstractValidator<UpdateRegionsDto>
{
    public UpdateRegionsDtoValidator()
    {
        RuleForEach(x => x.Regions)
            .SetValidator(new CreateRegionDtoValidator());
    }
}

public class AboutFeatureDtoValidator : AbstractValidator<AboutFeatureDto>
{
    public AboutFeatureDtoValidator()
    {
        RuleFor(x => x.Icon)
            .NotEmpty().WithMessage("İkon boş olamaz")
            .MaximumLength(50).WithMessage("İkon en fazla 50 karakter olabilir");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Başlık boş olamaz")
            .MaximumLength(100).WithMessage("Başlık en fazla 100 karakter olabilir");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Açıklama boş olamaz")
            .MaximumLength(500).WithMessage("Açıklama en fazla 500 karakter olabilir");
    }
}

public class UpdateAboutInfoDtoValidator : AbstractValidator<UpdateAboutInfoDto>
{
    public UpdateAboutInfoDtoValidator()
    {
        RuleFor(x => x.AboutTitle)
            .NotEmpty().WithMessage("Başlık boş olamaz")
            .MaximumLength(200).WithMessage("Başlık en fazla 200 karakter olabilir");

        RuleFor(x => x.AboutDescription)
            .NotEmpty().WithMessage("Açıklama boş olamaz")
            .MaximumLength(5000).WithMessage("Açıklama en fazla 5000 karakter olabilir");

        RuleForEach(x => x.Features)
            .SetValidator(new AboutFeatureDtoValidator());
    }
}

public class UpdateContactInfoDtoValidator : AbstractValidator<UpdateContactInfoDto>
{
    public UpdateContactInfoDtoValidator()
    {
        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Telefon numarası boş olamaz")
            .MaximumLength(50).WithMessage("Telefon numarası en fazla 50 karakter olabilir");

        RuleFor(x => x.Whatsapp)
            .NotEmpty().WithMessage("WhatsApp numarası boş olamaz")
            .MaximumLength(50).WithMessage("WhatsApp numarası en fazla 50 karakter olabilir");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta adresi boş olamaz")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz")
            .MaximumLength(100).WithMessage("E-posta adresi en fazla 100 karakter olabilir");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Adres boş olamaz")
            .MaximumLength(300).WithMessage("Adres en fazla 300 karakter olabilir");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("Şehir boş olamaz")
            .MaximumLength(100).WithMessage("Şehir en fazla 100 karakter olabilir");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Ülke boş olamaz")
            .MaximumLength(100).WithMessage("Ülke en fazla 100 karakter olabilir");

        RuleFor(x => x.InstagramUrl)
            .MaximumLength(200).WithMessage("Instagram URL'si en fazla 200 karakter olabilir");

        RuleFor(x => x.FacebookUrl)
            .MaximumLength(200).WithMessage("Facebook URL'si en fazla 200 karakter olabilir");

        RuleFor(x => x.TwitterUrl)
            .MaximumLength(200).WithMessage("Twitter URL'si en fazla 200 karakter olabilir");
    }
}

public class CreateFaqItemDtoValidator : AbstractValidator<CreateFaqItemDto>
{
    public CreateFaqItemDtoValidator()
    {
        RuleFor(x => x.Question)
            .NotEmpty().WithMessage("Soru boş olamaz")
            .MaximumLength(500).WithMessage("Soru en fazla 500 karakter olabilir");

        RuleFor(x => x.Answer)
            .NotEmpty().WithMessage("Cevap boş olamaz")
            .MaximumLength(2000).WithMessage("Cevap en fazla 2000 karakter olabilir");

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sıralama değeri 0 veya daha büyük olmalı");
    }
}

public class UpdateFaqsDtoValidator : AbstractValidator<UpdateFaqsDto>
{
    public UpdateFaqsDtoValidator()
    {
        RuleForEach(x => x.Faqs)
            .SetValidator(new CreateFaqItemDtoValidator());
    }
}
