using Serilog;
using Serilog.Events;
using FastEndpoints;
using FastEndpoints.Swagger;
using TekelBayim.Api.Middleware;
using TekelBayim.Application;
using TekelBayim.Infrastructure;
using TekelBayim.Infrastructure.Data;

// Serilog bootstrap logger
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting TekelBayim API...");

    var builder = WebApplication.CreateBuilder(args);

    // Serilog konfigürasyonu
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
        .WriteTo.File(
            path: "logs/tekelbayim-.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 7,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"));

    // Katman DI kayıtları
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    // FastEndpoints
    builder.Services.AddFastEndpoints();

    // Swagger/OpenAPI with JWT Support
    builder.Services.SwaggerDocument(o =>
    {
        o.DocumentSettings = s =>
        {
            s.Title = "TekelBayim API";
            s.Version = "v1";
            s.Description = "Tekel Bayisi Backend API - Kategori, Ürün, Stok Yönetimi\n\n" +
                           "**Authentication:**\n" +
                           "- 🌐 Web: Cookie-based (`/api/auth/login`)\n" +
                           "- 📱 Mobile/API: JWT Bearer (`/api/auth/token`)";
        };
        o.EnableJWTBearerAuth = true;
    });

    // CORS (geliştirme için)
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("DevPolicy", policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });

    var app = builder.Build();

    // Global exception handler
    app.UseGlobalExceptionHandler();

    // Serilog request logging
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    });

    app.UseHttpsRedirection();
    app.UseCors("DevPolicy");

    // Authentication & Authorization
    app.UseAuthentication();
    app.UseAuthorization();

    // FastEndpoints
    app.UseFastEndpoints(c =>
    {
        c.Endpoints.RoutePrefix = "api";
    });

    // Swagger
    app.UseSwaggerGen();

    // Seed database
    await DbSeeder.SeedAsync(app.Services);

    Log.Information("TekelBayim API started successfully");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
