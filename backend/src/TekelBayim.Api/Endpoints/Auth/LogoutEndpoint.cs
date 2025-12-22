using FastEndpoints;
using MediatR;
using TekelBayim.Application.Features.Auth.Commands.Logout;

namespace TekelBayim.Api.Endpoints.Auth;

public class LogoutResponse
{
    public string Message { get; set; } = "Başarıyla çıkış yapıldı";
}

public class LogoutEndpoint : EndpointWithoutRequest<LogoutResponse>
{
    private readonly IMediator _mediator;

    public LogoutEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("auth/logout");
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "Kullanıcı çıkışı (cookie-based)";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await _mediator.Send(new LogoutCommand(), ct);
        await SendOkAsync(new LogoutResponse(), ct);
    }
}
