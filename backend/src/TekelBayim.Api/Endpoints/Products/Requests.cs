namespace TekelBayim.Api.Endpoints.Products;

public class GetProductsRequest
{
    public Guid? CategoryId { get; set; }
    public string? Q { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStock { get; set; }
    public string? Sort { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetProductByIdRequest
{
    public Guid Id { get; set; }
}
