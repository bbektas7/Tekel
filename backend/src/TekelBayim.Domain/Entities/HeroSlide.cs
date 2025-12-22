using TekelBayim.Domain.Common;

namespace TekelBayim.Domain.Entities;

/// <summary>
/// Ana sayfa hero slider görselleri
/// </summary>
public class HeroSlide : BaseEntity
{
    public string ImageUrl { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
