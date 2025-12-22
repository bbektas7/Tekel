using TekelBayim.Domain.Common;

namespace TekelBayim.Domain.Entities;

/// <summary>
/// Site genel ayarları - Tekil kayıt
/// </summary>
public class SiteSettings : BaseEntity
{
    // About Section
    public string AboutTitle { get; set; } = string.Empty;
    public string AboutDescription { get; set; } = string.Empty;
    public string AboutFeaturesJson { get; set; } = "[]";

    // Contact Information
    public string Phone { get; set; } = string.Empty;
    public string Whatsapp { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;

    // Social Media Links
    public string? InstagramUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? TwitterUrl { get; set; }
}
