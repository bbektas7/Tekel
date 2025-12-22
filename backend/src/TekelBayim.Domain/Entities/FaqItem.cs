using TekelBayim.Domain.Common;

namespace TekelBayim.Domain.Entities;

/// <summary>
/// Sıkça Sorulan Sorular (FAQ) öğesi
/// </summary>
public class FaqItem : BaseEntity
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
