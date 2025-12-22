using FastEndpoints;
using MediatR;
using TekelBayim.Application.Features.Categories.Commands.DeleteCategory;

namespace TekelBayim.Api.Endpoints.Admin.Categories;

public class DeleteCategoryEndpoint : Endpoint<DeleteCategoryRequest>
{
    private readonly IMediator _mediator;
    private readonly ILogger<DeleteCategoryEndpoint> _logger;

    public DeleteCategoryEndpoint(IMediator mediator, ILogger<DeleteCategoryEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Delete("admin/categories/{id}");
        Roles("Admin", "Manager");
        Tags("Admin - Categories");
        Summary(s =>
        {
            s.Summary = "Kategori siler (ilişkili veriler varsa pasif yapar)";
        });
    }

    public override async Task HandleAsync(DeleteCategoryRequest req, CancellationToken ct)
    {
        await _mediator.Send(new DeleteCategoryCommand(req.Id), ct);
        _logger.LogInformation("Category deleted: {CategoryId}", req.Id);
        await SendNoContentAsync(ct);
    }
}
