using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Categories.Commands.UpdateCategory;

namespace TekelBayim.Api.Endpoints.Admin.Categories;

public class UpdateCategoryEndpoint : Endpoint<UpdateCategoryRequest, CategoryDto>
{
    private readonly IMediator _mediator;
    private readonly ILogger<UpdateCategoryEndpoint> _logger;

    public UpdateCategoryEndpoint(IMediator mediator, ILogger<UpdateCategoryEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Put("admin/categories/{id}");
        Roles("Admin", "Manager");
        Tags("Admin - Categories");
        Summary(s =>
        {
            s.Summary = "Kategori günceller";
        });
    }

    public override async Task HandleAsync(UpdateCategoryRequest req, CancellationToken ct)
    {
        var dto = new UpdateCategoryDto(req.Name, req.ParentCategoryId, req.SortOrder, req.IsActive);
        var result = await _mediator.Send(new UpdateCategoryCommand(req.Id, dto), ct);
        _logger.LogInformation("Category updated: {CategoryId}", req.Id);
        await SendOkAsync(result, ct);
    }
}
