using FastEndpoints;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Api.Endpoints.Auth;

public class GetTokenEndpoint : Endpoint<TokenRequest, TokenResponse>
{
    private readonly IAuthService _authService;

    public GetTokenEndpoint(IAuthService authService)
    {
        _authService = authService;
    }

    public override void Configure()
    {
        Post("auth/token");
        AllowAnonymous();
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "JWT Token alma (Mobile/API için)";
            s.Description = "Mobile uygulamalar ve 3rd party API entegrasyonları için JWT token döner. Access token süresi: 15 dakika, Refresh token süresi: 7 gün";
        });
    }

    public override async Task HandleAsync(TokenRequest req, CancellationToken ct)
    {
        var ipAddress = GetIpAddress();
        var result = await _authService.GenerateTokenAsync(req, ipAddress);

        if (!result.Succeeded)
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        await SendOkAsync(result.Token!, ct);
    }

    private string? GetIpAddress()
    {
        if (HttpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            return HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        }
        return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
    }
}
