using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Auth.Commands.Register;

namespace TekelBayim.Api.Endpoints.Auth;

public class RegisterEndpoint : Endpoint<RegisterRequest, UserMeResponse>
{
    private readonly IMediator _mediator;

    public RegisterEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("auth/register");
        AllowAnonymous();
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "Kullanıcı kaydı";
        });
    }

    public override async Task HandleAsync(RegisterRequest req, CancellationToken ct)
    {
        var result = await _mediator.Send(new RegisterCommand(req), ct);

        if (!result.Succeeded)
        {
            AddError(result.ErrorMessage ?? "Kayıt başarısız");
            await SendErrorsAsync(400, ct);
            return;
        }

        await SendCreatedAtAsync<GetMeEndpoint>(null, result.User!, cancellation: ct);
    }
}
