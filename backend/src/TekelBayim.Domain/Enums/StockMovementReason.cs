namespace TekelBayim.Domain.Enums;

/// <summary>
/// Stok hareketi nedenleri
/// </summary>
public enum StockMovementReason
{
    ManualAdjustment = 0,
    Restock = 1,
    Sale = 2,
    Damage = 3,
    Other = 4
}
