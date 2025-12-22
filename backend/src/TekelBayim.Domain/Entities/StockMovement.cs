using TekelBayim.Domain.Common;
using TekelBayim.Domain.Enums;

namespace TekelBayim.Domain.Entities;

/// <summary>
/// Stok hareketi kaydı
/// </summary>
public class StockMovement : BaseEntity
{
    public Guid ProductId { get; set; }
    public int QuantityDelta { get; set; }
    public StockMovementReason Reason { get; set; }
    public string? Note { get; set; }
    public Guid? CreatedByUserId { get; set; }

    // Navigation properties
    public virtual Product Product { get; set; } = null!;
}
