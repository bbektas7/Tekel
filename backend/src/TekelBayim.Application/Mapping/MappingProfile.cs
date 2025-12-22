using AutoMapper;
using TekelBayim.Application.DTOs;
using TekelBayim.Domain.Entities;

namespace TekelBayim.Application.Mapping;

/// <summary>
/// AutoMapper mapping profili
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Category mappings
        CreateMap<Category, CategoryDto>();

        // Product mappings
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

        CreateMap<Product, ProductListDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

        // StockMovement mappings
        CreateMap<StockMovement, StockMovementDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason.ToString()));

        // HeroSlide mappings
        CreateMap<HeroSlide, HeroSlideDto>();

        // Region mappings
        CreateMap<Region, RegionDto>();

        // FaqItem mappings
        CreateMap<FaqItem, FaqItemDto>();
    }
}
