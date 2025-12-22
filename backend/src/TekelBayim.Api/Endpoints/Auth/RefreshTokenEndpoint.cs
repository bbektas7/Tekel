using FastEndpoints;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Api.Endpoints.Auth;

public class RefreshTokenEndpoint : Endpoint<RefreshTokenRequest, TokenResponse>
{
    private readonly IAuthService _authService;

    public RefreshTokenEndpoint(IAuthService authService)
    {
        _authService = authService;
    }

    public override void Configure()
    {
        Post("auth/refresh-token");
        AllowAnonymous();
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "JWT Token yenileme (Refresh Token ile)";
            s.Description = "Access token süresi dolduğunda, refresh token ile yeni token alınır. Refresh token tek kullanımlıktır (rotation).";
        });
    }

    public override async Task HandleAsync(RefreshTokenRequest req, CancellationToken ct)
    {
        var ipAddress = GetIpAddress();
        var result = await _authService.RefreshTokenAsync(req.RefreshToken, ipAddress);

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
