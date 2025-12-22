using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;
using TekelBayim.Infrastructure.Data;
using TekelBayim.Infrastructure.Identity;
using TekelBayim.Infrastructure.Settings;

namespace TekelBayim.Infrastructure.Services;

/// <summary>
/// Kimlik doğrulama servisi implementasyonu - Cookie + JWT Hybrid
/// </summary>
public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly AppDbContext _dbContext;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        AppDbContext dbContext,
        IOptions<JwtSettings> jwtSettings,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
        _jwtSettings = jwtSettings.Value;
        _logger = logger;
    }

    #region Cookie-Based Authentication (Web)

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Login attempt failed: user not found for email {Email}", request.Email);
            return new AuthResult(false, ErrorMessage: "Geçersiz e-posta veya şifre");
        }

        var result = await _signInManager.PasswordSignInAsync(
            user,
            request.Password,
            isPersistent: request.RememberMe,
            lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                _logger.LogWarning("User {Email} is locked out", request.Email);
                return new AuthResult(false, 
                    ErrorMessage: "Hesabınız geçici olarak kilitlendi. Lütfen daha sonra tekrar deneyin.",
                    IsLockedOut: true);
            }

            _logger.LogWarning("Login attempt failed: invalid password for {Email}", request.Email);
            return new AuthResult(false, ErrorMessage: "Geçersiz e-posta veya şifre");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var userResponse = new UserMeResponse(
            user.Id,
            user.Email!,
            user.DisplayName,
            user.PhoneNumber,
            roles
        );

        _logger.LogInformation("User {Email} logged in successfully (Cookie)", request.Email);

        return new AuthResult(true, userResponse);
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return new AuthResult(false, ErrorMessage: "Bu e-posta adresi zaten kullanılıyor");
        }

        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName,
            PhoneNumber = request.Phone,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return new AuthResult(false, ErrorMessage: "Kayıt başarısız", Errors: errors);
        }

        // Varsayılan olarak Customer rolü ata
        await _userManager.AddToRoleAsync(user, "Customer");

        // Otomatik giriş yap
        await _signInManager.SignInAsync(user, isPersistent: false);

        var roles = await _userManager.GetRolesAsync(user);
        var userResponse = new UserMeResponse(
            user.Id,
            user.Email!,
            user.DisplayName,
            user.PhoneNumber,
            roles
        );

        _logger.LogInformation("New user registered: {Email}", request.Email);

        return new AuthResult(true, userResponse);
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out (Cookie)");
    }

    public async Task<UserMeResponse?> GetCurrentUserAsync(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            return null;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new UserMeResponse(
            user.Id,
            user.Email!,
            user.DisplayName,
            user.PhoneNumber,
            roles
        );
    }

    #endregion

    #region JWT-Based Authentication (Mobile/API)

    public async Task<TokenResult> GenerateTokenAsync(TokenRequest request, string? ipAddress = null)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Token generation failed: user not found for email {Email}", request.Email);
            return new TokenResult(false, ErrorMessage: "Geçersiz e-posta veya şifre");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
        {
            _logger.LogWarning("Token generation failed: invalid password for {Email}", request.Email);
            return new TokenResult(false, ErrorMessage: "Geçersiz e-posta veya şifre");
        }

        // Lockout kontrolü
        if (await _userManager.IsLockedOutAsync(user))
        {
            _logger.LogWarning("User {Email} is locked out", request.Email);
            return new TokenResult(false, ErrorMessage: "Hesabınız geçici olarak kilitlendi");
        }

        var tokenResponse = await CreateTokensAsync(user, ipAddress);

        _logger.LogInformation("JWT Token generated for user {Email}", request.Email);

        return new TokenResult(true, tokenResponse);
    }

    public async Task<TokenResult> RefreshTokenAsync(string refreshToken, string? ipAddress = null)
    {
        var storedToken = await _dbContext.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (storedToken == null)
        {
            _logger.LogWarning("Refresh token not found");
            return new TokenResult(false, ErrorMessage: "Geçersiz refresh token");
        }

        if (!storedToken.IsActive)
        {
            _logger.LogWarning("Refresh token is not active (expired or revoked)");
            return new TokenResult(false, ErrorMessage: "Refresh token geçersiz veya süresi dolmuş");
        }

        var user = storedToken.User;

        // Eski token'ı revoke et
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;
        storedToken.RevokeReason = "Replaced by new token";

        // Yeni tokenlar oluştur
        var tokenResponse = await CreateTokensAsync(user, ipAddress);

        // Eski token'a yeni token referansını ekle
        storedToken.ReplacedByToken = tokenResponse.RefreshToken;

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("JWT Token refreshed for user {Email}", user.Email);

        return new TokenResult(true, tokenResponse);
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken, string? ipAddress = null)
    {
        var storedToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (storedToken == null || !storedToken.IsActive)
        {
            return false;
        }

        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;
        storedToken.RevokeReason = "Revoked by user";

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Refresh token revoked");

        return true;
    }

    #endregion

    #region Private Helper Methods

    private async Task<TokenResponse> CreateTokensAsync(AppUser user, string? ipAddress)
    {
        var roles = await _userManager.GetRolesAsync(user);

        // Access Token oluştur
        var accessToken = GenerateAccessToken(user, roles);
        var accessTokenExpiry = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes);

        // Refresh Token oluştur
        var refreshToken = GenerateRefreshToken();
        var refreshTokenExpiry = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);

        // Refresh Token'ı veritabanına kaydet
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = refreshTokenExpiry,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };

        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        var userResponse = new UserMeResponse(
            user.Id,
            user.Email!,
            user.DisplayName,
            user.PhoneNumber,
            roles
        );

        return new TokenResponse(
            accessToken,
            refreshToken,
            accessTokenExpiry,
            refreshTokenExpiry,
            userResponse
        );
    }

    private string GenerateAccessToken(AppUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.Name, user.DisplayName ?? user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        // Rolleri ekle
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    #endregion
}
