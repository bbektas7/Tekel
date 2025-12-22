namespace TekelBayim.Application.DTOs;

/// <summary>
/// Ürün görüntüleme DTO
/// </summary>
public record ProductDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string Name,
    string? Brand,
    string? Volume,
    decimal Price,
    int StockQuantity,
    string? Description,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt
);

/// <summary>
/// Ürün listesi için özet DTO
/// </summary>
public record ProductListDto(
    Guid Id,
    string Name,
    string? Brand,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    bool IsActive,
    string CategoryName,
    Guid CategoryId
);

/// <summary>
/// Ürün oluşturma DTO
/// </summary>
public record CreateProductDto(
    Guid CategoryId,
    string Name,
    string? Brand,
    string? Volume,
    decimal Price,
    int StockQuantity,
    string? Description,
    string? ImageUrl
);

/// <summary>
/// Ürün güncelleme DTO
/// </summary>
public record UpdateProductDto(
    Guid CategoryId,
    string Name,
    string? Brand,
    string? Volume,
    decimal Price,
    string? Description,
    string? ImageUrl,
    bool IsActive
);
