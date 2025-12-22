using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Auth.Commands.Login;

namespace TekelBayim.Api.Endpoints.Auth;

public class LoginEndpoint : Endpoint<LoginRequest, UserMeResponse>
{
    private readonly IMediator _mediator;

    public LoginEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("auth/login");
        AllowAnonymous();
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "Kullanıcı girişi (cookie-based - Web için)";
        });
    }

    public override async Task HandleAsync(LoginRequest req, CancellationToken ct)
    {
        var result = await _mediator.Send(new LoginCommand(req), ct);

        if (!result.Succeeded)
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        await SendOkAsync(result.User!, ct);
    }
}
