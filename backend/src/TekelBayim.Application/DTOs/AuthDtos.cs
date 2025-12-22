namespace TekelBayim.Application.DTOs;

/// <summary>
/// Giriş isteği
/// </summary>
public record LoginRequest(
    string Email,
    string Password,
    bool RememberMe = false
);

/// <summary>
/// Kayıt isteği (opsiyonel - admin seed'li sistem için)
/// </summary>
public record RegisterRequest(
    string Email,
    string Password,
    string? DisplayName,
    string? Phone
);

/// <summary>
/// Mevcut kullanıcı bilgisi
/// </summary>
public record UserMeResponse(
    Guid Id,
    string Email,
    string? DisplayName,
    string? Phone,
    IList<string> Roles
);

/// <summary>
/// JWT Token isteği (Mobile/API için)
/// </summary>
public record TokenRequest(
    string Email,
    string Password
);

/// <summary>
/// JWT Token yanıtı
/// </summary>
public record TokenResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt,
    UserMeResponse User
);

/// <summary>
/// Refresh token isteği
/// </summary>
public record RefreshTokenRequest(
    string RefreshToken
);

/// <summary>
/// Token revoke isteği
/// </summary>
public record RevokeTokenRequest(
    string RefreshToken
);
