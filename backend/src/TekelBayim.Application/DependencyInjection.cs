using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TekelBayim.Application.Behaviors;
using TekelBayim.Application.Mapping;

namespace TekelBayim.Application;

/// <summary>
/// Application katmanı DI konfigürasyonu
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;

        // MediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // FluentValidation
        services.AddValidatorsFromAssembly(assembly);

        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        return services;
    }
}
