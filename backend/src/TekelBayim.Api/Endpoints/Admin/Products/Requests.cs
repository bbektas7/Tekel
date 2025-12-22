namespace TekelBayim.Api.Endpoints.Admin.Products;

public class UpdateProductRequest
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Volume { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
}

public class DeleteProductRequest
{
    public Guid Id { get; set; }
}
