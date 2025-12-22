using Microsoft.AspNetCore.Identity;

namespace TekelBayim.Infrastructure.Identity;

/// <summary>
/// Uygulama kullanıcısı - ASP.NET Core Identity üzerine kurulu
/// </summary>
public class AppUser : IdentityUser<Guid>
{
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
