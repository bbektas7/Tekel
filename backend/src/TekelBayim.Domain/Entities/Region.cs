using TekelBayim.Domain.Common;

namespace TekelBayim.Domain.Entities;

/// <summary>
/// Teslimat bölgeleri
/// </summary>
public class Region : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
