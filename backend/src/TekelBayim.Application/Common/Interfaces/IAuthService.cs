using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Common.Interfaces;

/// <summary>
/// Kimlik doğrulama servis interface'i
/// </summary>
public interface IAuthService
{
    // Cookie-based auth (Web için)
    Task<AuthResult> LoginAsync(LoginRequest request);
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task LogoutAsync();
    Task<UserMeResponse?> GetCurrentUserAsync(string userId);
    
    // JWT-based auth (Mobile/API için)
    Task<TokenResult> GenerateTokenAsync(TokenRequest request, string? ipAddress = null);
    Task<TokenResult> RefreshTokenAsync(string refreshToken, string? ipAddress = null);
    Task<bool> RevokeTokenAsync(string refreshToken, string? ipAddress = null);
}

/// <summary>
/// Auth işlem sonucu (Cookie-based)
/// </summary>
public record AuthResult(
    bool Succeeded,
    UserMeResponse? User = null,
    string? ErrorMessage = null,
    List<string>? Errors = null,
    bool IsLockedOut = false
);

/// <summary>
/// Token işlem sonucu (JWT-based)
/// </summary>
public record TokenResult(
    bool Succeeded,
    TokenResponse? Token = null,
    string? ErrorMessage = null
);
