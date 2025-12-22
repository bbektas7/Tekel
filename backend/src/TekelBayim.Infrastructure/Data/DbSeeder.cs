using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TekelBayim.Domain.Entities;
using TekelBayim.Domain.Enums;
using TekelBayim.Infrastructure.Identity;
using TekelBayim.Shared.Helpers;

namespace TekelBayim.Infrastructure.Data;

/// <summary>
/// Veritabanı seed işlemleri - Admin kullanıcı, roller ve örnek veriler
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

        try
        {
            // Migration'ları uygula
            await context.Database.MigrateAsync();

            // Rolleri oluştur
            await SeedRolesAsync(roleManager, logger);

            // Admin kullanıcıyı oluştur
            await SeedAdminUserAsync(userManager, logger);

            // Örnek kategorileri ve ürünleri oluştur
            await SeedSampleDataAsync(context, logger);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Seed işlemi sırasında hata oluştu");
            throw;
        }
    }

    private static async Task SeedRolesAsync(RoleManager<AppRole> roleManager, ILogger logger)
    {
        var roles = new[] { "Admin", "Manager", "Customer" };

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var result = await roleManager.CreateAsync(new AppRole(roleName));
                if (result.Succeeded)
                {
                    logger.LogInformation("Rol oluşturuldu: {RoleName}", roleName);
                }
                else
                {
                    logger.LogError("Rol oluşturulamadı: {RoleName}, Hatalar: {Errors}",
                        roleName, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }

    private static async Task SeedAdminUserAsync(UserManager<AppUser> userManager, ILogger logger)
    {
        const string adminEmail = "admin@tekelbayim.local";
        const string adminPassword = "Admin123!";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin != null)
        {
            logger.LogInformation("Admin kullanıcı zaten mevcut");
            return;
        }

        var adminUser = new AppUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            DisplayName = "Sistem Yöneticisi",
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(adminUser, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            logger.LogInformation("Admin kullanıcı oluşturuldu: {Email}", adminEmail);
        }
        else
        {
            logger.LogError("Admin kullanıcı oluşturulamadı: {Errors}",
                string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }

    private static async Task SeedSampleDataAsync(AppDbContext context, ILogger logger)
    {
        // Kategori yoksa örnek kategoriler ekle
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Biralar",
                    Slug = SlugHelper.GenerateSlug("Biralar"),
                    SortOrder = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Rakılar",
                    Slug = SlugHelper.GenerateSlug("Rakılar"),
                    SortOrder = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Şaraplar",
                    Slug = SlugHelper.GenerateSlug("Şaraplar"),
                    SortOrder = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Viskiler",
                    Slug = SlugHelper.GenerateSlug("Viskiler"),
                    SortOrder = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Votkalar",
                    Slug = SlugHelper.GenerateSlug("Votkalar"),
                    SortOrder = 5,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
            logger.LogInformation("{Count} kategori oluşturuldu", categories.Count);

            // Örnek ürünler ekle
            var biraCategory = categories.First(c => c.Name == "Biralar");
            var rakiCategory = categories.First(c => c.Name == "Rakılar");
            var sarapCategory = categories.First(c => c.Name == "Şaraplar");

            var products = new List<Product>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = biraCategory.Id,
                    Name = "Efes Pilsen",
                    Brand = "Efes",
                    Volume = "500ml",
                    Price = 85.00m,
                    StockQuantity = 100,
                    Description = "Türkiye'nin en popüler birası",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = biraCategory.Id,
                    Name = "Tuborg Gold",
                    Brand = "Tuborg",
                    Volume = "500ml",
                    Price = 82.00m,
                    StockQuantity = 75,
                    Description = "Premium lager bira",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = rakiCategory.Id,
                    Name = "Yeni Rakı",
                    Brand = "Mey",
                    Volume = "700ml",
                    Price = 850.00m,
                    StockQuantity = 30,
                    Description = "Geleneksel Türk rakısı",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = rakiCategory.Id,
                    Name = "Tekirdağ Rakısı",
                    Brand = "Mey",
                    Volume = "700ml",
                    Price = 920.00m,
                    StockQuantity = 25,
                    Description = "Premium Türk rakısı",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = sarapCategory.Id,
                    Name = "Kavaklıdere Angora",
                    Brand = "Kavaklıdere",
                    Volume = "750ml",
                    Price = 350.00m,
                    StockQuantity = 40,
                    Description = "Kırmızı şarap",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    CategoryId = sarapCategory.Id,
                    Name = "Doluca Öküzgözü",
                    Brand = "Doluca",
                    Volume = "750ml",
                    Price = 420.00m,
                    StockQuantity = 3, // Düşük stok örneği
                    Description = "Anadolu şarabı",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
            logger.LogInformation("{Count} ürün oluşturuldu", products.Count);

            // Örnek stok hareketleri
            var stockMovements = products.Select(p => new StockMovement
            {
                Id = Guid.NewGuid(),
                ProductId = p.Id,
                QuantityDelta = p.StockQuantity,
                Reason = StockMovementReason.Restock,
                Note = "İlk stok girişi",
                CreatedAt = DateTime.UtcNow
            }).ToList();

            context.StockMovements.AddRange(stockMovements);
            await context.SaveChangesAsync();
            logger.LogInformation("{Count} stok hareketi oluşturuldu", stockMovements.Count);
        }

        // Site Settings seed
        await SeedSiteSettingsAsync(context, logger);
    }

    private static async Task SeedSiteSettingsAsync(AppDbContext context, ILogger logger)
    {
        // SiteSettings yoksa oluştur
        if (!await context.SiteSettings.AnyAsync())
        {
            var siteSettings = new SiteSettings
            {
                Id = Guid.NewGuid(),
                AboutTitle = "Buca'nın Zamansız Tekeli",
                AboutDescription = "ADO Tekel & Tobacco olarak, 7/24 kesintisiz hizmet anlayışıyla müşterilerimize en kaliteli içecek ve gıda ürünlerini sunuyoruz.\n\nGüvenilir markalardan oluşan zengin ürün portföyümüz, tecrübeli ekibimiz ve müşteri memnuniyeti odaklı yaklaşımımızla Buca ve çevresinde tercih edilen adres olmaktan gurur duyuyoruz.\n\nSipariş vermek için WhatsApp, telefon veya web sitemizi kullanabilir, dilediğiniz zaman güvenle alışveriş yapabilirsiniz.",
                AboutFeaturesJson = "[{\"Icon\":\"🕐\",\"Title\":\"7/24 Hizmet\",\"Description\":\"Gece gündüz hizmetinizdeyiz\"},{\"Icon\":\"🚀\",\"Title\":\"Hızlı Teslimat\",\"Description\":\"Ortalama 30 dakikada kapınızda\"},{\"Icon\":\"✅\",\"Title\":\"Güvenilir Marka\",\"Description\":\"Yıllardır kalite garantisi\"}]",
                Phone = "+90 546 954 98 97",
                Whatsapp = "+90 546 954 98 97",
                Email = "info@adotekel.com",
                Address = "Buca, Menderes Caddesi No:128/A",
                City = "35390 İzmir",
                Country = "Türkiye",
                InstagramUrl = "#",
                CreatedAt = DateTime.UtcNow
            };

            context.SiteSettings.Add(siteSettings);
            await context.SaveChangesAsync();
            logger.LogInformation("Site ayarları oluşturuldu");
        }

        // HeroSlides yoksa oluştur
        if (!await context.HeroSlides.AnyAsync())
        {
            var heroSlide = new HeroSlide
            {
                Id = Guid.NewGuid(),
                ImageUrl = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974",
                Title = "ADO TEKEL",
                Subtitle = "Hızlı ve Ücretsiz Eve Sipariş",
                SortOrder = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.HeroSlides.Add(heroSlide);
            await context.SaveChangesAsync();
            logger.LogInformation("Hero slide oluşturuldu");
        }

        // Regions yoksa oluştur
        if (!await context.Regions.AnyAsync())
        {
            var regionNames = new[] { "Buca Merkez", "Evka-1", "Gediz", "Enhoşlar", "Şirinyer", "Yıldız", "Tınaztepe", "Fırat" };
            var regions = regionNames.Select((name, index) => new Region
            {
                Id = Guid.NewGuid(),
                Name = name,
                SortOrder = index + 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            context.Regions.AddRange(regions);
            await context.SaveChangesAsync();
            logger.LogInformation("{Count} bölge oluşturuldu", regions.Count);
        }
    }
}
