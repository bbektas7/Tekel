using Microsoft.AspNetCore.Identity;

namespace TekelBayim.Infrastructure.Identity;

/// <summary>
/// Uygulama rolü - ASP.NET Core Identity üzerine kurulu
/// </summary>
public class AppRole : IdentityRole<Guid>
{
    public AppRole() { }

    public AppRole(string roleName) : base(roleName) { }
}
