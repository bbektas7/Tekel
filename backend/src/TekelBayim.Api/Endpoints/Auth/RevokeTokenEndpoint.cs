using FastEndpoints;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Api.Endpoints.Auth;

public class RevokeTokenResponse
{
    public string Message { get; set; } = "Token iptal edildi";
}

public class RevokeTokenEndpoint : Endpoint<RevokeTokenRequest, RevokeTokenResponse>
{
    private readonly IAuthService _authService;

    public RevokeTokenEndpoint(IAuthService authService)
    {
        _authService = authService;
    }

    public override void Configure()
    {
        Post("auth/revoke-token");
        Tags("Auth");
        Summary(s =>
        {
            s.Summary = "Refresh Token'ı iptal et (Logout for JWT)";
            s.Description = "JWT tabanlı çıkış işlemi. Refresh token iptal edilir.";
        });
    }

    public override async Task HandleAsync(RevokeTokenRequest req, CancellationToken ct)
    {
        var ipAddress = GetIpAddress();
        var result = await _authService.RevokeTokenAsync(req.RefreshToken, ipAddress);

        if (!result)
        {
            AddError("Geçersiz refresh token");
            await SendErrorsAsync(400, ct);
            return;
        }

        await SendOkAsync(new RevokeTokenResponse(), ct);
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
