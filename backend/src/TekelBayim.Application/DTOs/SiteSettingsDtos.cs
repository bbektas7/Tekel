namespace TekelBayim.Application.DTOs;

#region Hero Slides

/// <summary>
/// Hero slide görüntüleme DTO
/// </summary>
public record HeroSlideDto(
    Guid Id,
    string ImageUrl,
    string? Title,
    string? Subtitle,
    int SortOrder,
    bool IsActive,
    DateTime CreatedAt
);

/// <summary>
/// Hero slide oluşturma DTO
/// </summary>
public record CreateHeroSlideDto(
    string ImageUrl,
    string? Title,
    string? Subtitle,
    int SortOrder,
    bool IsActive = true
);

/// <summary>
/// Hero slides toplu güncelleme DTO
/// </summary>
public record UpdateHeroSlidesDto(
    List<CreateHeroSlideDto> Slides
);

#endregion

#region Regions

/// <summary>
/// Bölge görüntüleme DTO
/// </summary>
public record RegionDto(
    Guid Id,
    string Name,
    int SortOrder,
    bool IsActive,
    DateTime CreatedAt
);

/// <summary>
/// Bölge oluşturma DTO
/// </summary>
public record CreateRegionDto(
    string Name,
    int SortOrder,
    bool IsActive = true
);

/// <summary>
/// Bölgeler toplu güncelleme DTO
/// </summary>
public record UpdateRegionsDto(
    List<CreateRegionDto> Regions
);

#endregion

#region About Info

/// <summary>
/// Hakkında özellik DTO
/// </summary>
public record AboutFeatureDto(
    string Icon,
    string Title,
    string Description
);

/// <summary>
/// Hakkında bilgileri DTO
/// </summary>
public record AboutInfoDto(
    string AboutTitle,
    string AboutDescription,
    List<AboutFeatureDto> Features
);

/// <summary>
/// Hakkında bilgileri güncelleme DTO
/// </summary>
public record UpdateAboutInfoDto(
    string AboutTitle,
    string AboutDescription,
    List<AboutFeatureDto> Features
);

#endregion

#region Contact Info

/// <summary>
/// İletişim bilgileri DTO
/// </summary>
public record ContactInfoDto(
    string Phone,
    string Whatsapp,
    string Email,
    string Address,
    string City,
    string Country,
    string? InstagramUrl,
    string? FacebookUrl,
    string? TwitterUrl
);

/// <summary>
/// İletişim bilgileri güncelleme DTO
/// </summary>
public record UpdateContactInfoDto(
    string Phone,
    string Whatsapp,
    string Email,
    string Address,
    string City,
    string Country,
    string? InstagramUrl,
    string? FacebookUrl,
    string? TwitterUrl
);

#endregion

#region FAQ Items

/// <summary>
/// FAQ öğesi görüntüleme DTO
/// </summary>
public record FaqItemDto(
    Guid Id,
    string Question,
    string Answer,
    int SortOrder,
    bool IsActive,
    DateTime CreatedAt
);

/// <summary>
/// FAQ öğesi oluşturma DTO
/// </summary>
public record CreateFaqItemDto(
    string Question,
    string Answer,
    int SortOrder,
    bool IsActive = true
);

/// <summary>
/// FAQ'ları toplu güncelleme DTO
/// </summary>
public record UpdateFaqsDto(
    List<CreateFaqItemDto> Faqs
);

#endregion

#region Site Settings Response

/// <summary>
/// Tüm site ayarları response DTO
/// </summary>
public record SiteSettingsResponseDto(
    List<HeroSlideDto> HeroSlides,
    AboutInfoDto AboutInfo,
    List<RegionDto> Regions,
    ContactInfoDto ContactInfo,
    List<FaqItemDto> Faqs
);

#endregion
