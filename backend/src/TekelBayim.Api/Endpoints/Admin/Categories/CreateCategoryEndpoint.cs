using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Categories.Commands.CreateCategory;

namespace TekelBayim.Api.Endpoints.Admin.Categories;

public class CreateCategoryEndpoint : Endpoint<CreateCategoryDto, CategoryDto>
{
    private readonly IMediator _mediator;
    private readonly ILogger<CreateCategoryEndpoint> _logger;

    public CreateCategoryEndpoint(IMediator mediator, ILogger<CreateCategoryEndpoint> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override void Configure()
    {
        Post("admin/categories");
        Roles("Admin", "Manager");
        Tags("Admin - Categories");
        Summary(s =>
        {
            s.Summary = "Yeni kategori oluşturur";
        });
    }

    public override async Task HandleAsync(CreateCategoryDto req, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateCategoryCommand(req), ct);
        _logger.LogInformation("Category created: {CategoryId} - {CategoryName}", result.Id, result.Name);
        await SendAsync( result, cancellation: ct);
    }
}
