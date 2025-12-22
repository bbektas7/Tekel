using TekelBayim.Domain.Enums;

namespace TekelBayim.Api.Endpoints.Admin.Stock;

public class AdjustStockRequest
{
    public Guid Id { get; set; }
    public int QuantityDelta { get; set; }
    public StockMovementReason Reason { get; set; }
    public string? Note { get; set; }
}

public class GetStockMovementsRequest
{
    public Guid? ProductId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
