namespace TekelBayim.Api.Endpoints.Admin.Categories;

public class UpdateCategoryRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? ParentCategoryId { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
}

public class DeleteCategoryRequest
{
    public Guid Id { get; set; }
}
