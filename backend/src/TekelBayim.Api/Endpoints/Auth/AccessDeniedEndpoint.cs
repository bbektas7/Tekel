using FastEndpoints;

namespace TekelBayim.Api.Endpoints.Auth;

public class AccessDeniedEndpoint : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("auth/access-denied");
        AllowAnonymous();
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "Erişim reddedildi sayfası (API için 403 döner)";
        });
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        await SendForbiddenAsync(ct);
    }
}
