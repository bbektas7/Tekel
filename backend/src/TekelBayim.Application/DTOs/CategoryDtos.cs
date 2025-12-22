namespace TekelBayim.Application.DTOs;

/// <summary>
/// Kategori görüntüleme DTO
/// </summary>
public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    Guid? ParentCategoryId,
    int SortOrder,
    bool IsActive,
    DateTime CreatedAt
);

/// <summary>
/// Kategori oluşturma DTO
/// </summary>
public record CreateCategoryDto(
    string Name,
    Guid? ParentCategoryId,
    int SortOrder = 0
);

/// <summary>
/// Kategori güncelleme DTO
/// </summary>
public record UpdateCategoryDto(
    string Name,
    Guid? ParentCategoryId,
    int SortOrder,
    bool IsActive
);
