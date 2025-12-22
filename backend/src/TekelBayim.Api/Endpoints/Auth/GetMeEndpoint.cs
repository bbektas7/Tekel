using System.Security.Claims;
using FastEndpoints;
using MediatR;
using TekelBayim.Application.DTOs;
using TekelBayim.Application.Features.Auth.Queries.GetCurrentUser;

namespace TekelBayim.Api.Endpoints.Auth;

public class GetMeEndpoint : EndpointWithoutRequest<UserMeResponse>
{
    private readonly IMediator _mediator;

    public GetMeEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("auth/me");
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "Mevcut kullanıcı bilgilerini getirir";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        var result = await _mediator.Send(new GetCurrentUserQuery(userId), ct);

        if (result == null)
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        await SendOkAsync(result, ct);
    }
}
