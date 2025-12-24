import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useProductsQuery, useCategoriesQuery } from "../../hooks";
import {
  Container,
  PageTitle,
  FormInput,
  FormSelect,
  Badge,
  Skeleton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  PaginationWrapper,
  PaginationButton,
  Toggle,
} from "../../styles";
import { theme } from "../../styles/theme";
import type { ProductsQueryParams, Category, Product } from "../../types";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Get query params from URL
  const getQueryParams = useCallback((): ProductsQueryParams => {
    return {
      categoryId: searchParams.get("categoryId") || undefined,
      q: searchParams.get("q") || undefined,
      inStock: searchParams.get("inStock") === "true" ? true : undefined,
      sort:
        (searchParams.get("sort") as ProductsQueryParams["sort"]) || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(searchParams.get("pageSize") || "12", 10),
    };
  }, [searchParams]);

  const queryParams = getQueryParams();

  const { data: productsData, isLoading: productsLoading } =
    useProductsQuery(queryParams);
  const { data: categories } = useCategoriesQuery();

  const [searchTerm, setSearchTerm] = useState(queryParams.q || "");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (queryParams.q || "")) {
        updateParams({ q: searchTerm || undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const updateParams = (newParams: Partial<ProductsQueryParams>) => {
    const current = getQueryParams();
    const updated = { ...current, ...newParams };

    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== 1) {
        params.set(key, String(value));
      } else if (key === "page" && value === 1) {
        // Don't set page=1, it's the default
      } else if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  const handleCategoryChange = (categoryId: string) => {
    updateParams({ categoryId: categoryId || undefined, page: 1 });
  };

  const handleSortChange = (sort: string) => {
    updateParams({ sort: (sort as ProductsQueryParams["sort"]) || undefined });
  };

  const handleInStockToggle = () => {
    updateParams({ inStock: !queryParams.inStock ? true : undefined, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <PageTitle>Ürünlerimiz</PageTitle>
          <MobileFilterButton
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            🔍 Filtrele
          </MobileFilterButton>
        </Header>

        <ContentWrapper>
          {/* Filter Panel */}
          <FilterPanel $isOpen={mobileFilterOpen}>
            <FilterSection>
              <FilterTitle>Kategoriler</FilterTitle>
              <CategoryList>
                <CategoryItem
                  $active={!queryParams.categoryId}
                  onClick={() => handleCategoryChange("")}
                >
                  Tüm Ürünler
                </CategoryItem>
                {categories?.map((category: Category) => (
                  <CategoryItem
                    key={category.id}
                    $active={queryParams.categoryId === category.id}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                    {category.productCount !== undefined && (
                      <CategoryCount>({category.productCount})</CategoryCount>
                    )}
                  </CategoryItem>
                ))}
              </CategoryList>
            </FilterSection>

            <FilterSection>
              <Toggle>
                <input
                  type="checkbox"
                  checked={queryParams.inStock || false}
                  onChange={handleInStockToggle}
                />
                <span />
                Sadece Stokta Olanlar
              </Toggle>
            </FilterSection>

            <MobileFilterClose onClick={() => setMobileFilterOpen(false)}>
              Filtreleri Uygula
            </MobileFilterClose>
          </FilterPanel>

          {/* Products Area */}
          <ProductsArea>
            {/* Search and Sort Bar */}
            <SearchSortBar>
              <SearchInput
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SortSelect
                value={queryParams.sort || ""}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="">Varsayılan Sıralama</option>
                <option value="priceAsc">Fiyat: Düşükten Yükseğe</option>
                <option value="priceDesc">Fiyat: Yüksekten Düşüğe</option>
                <option value="newest">En Yeniler</option>
                <option value="nameAsc">A-Z Sıralama</option>
              </SortSelect>
            </SearchSortBar>

            {/* Products Grid */}
            {productsLoading ? (
              <ProductGrid>
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index}>
                    <Skeleton $height="180px" $radius="12px" />
                    <SkeletonContent>
                      <Skeleton $height="20px" $width="80%" />
                      <Skeleton $height="16px" $width="60%" />
                      <Skeleton $height="24px" $width="40%" />
                    </SkeletonContent>
                  </SkeletonCard>
                ))}
              </ProductGrid>
            ) : productsData?.items.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>📦</EmptyStateIcon>
                <EmptyStateTitle>Ürün Bulunamadı</EmptyStateTitle>
                <EmptyStateText>
                  Arama kriterlerinize uygun ürün bulunamadı. Farklı filtreler
                  deneyebilirsiniz.
                </EmptyStateText>
              </EmptyState>
            ) : (
              <>
                <ResultCount>
                  {productsData?.totalCount} ürün bulundu
                </ResultCount>
                <ProductGrid>
                  {productsData?.items.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      to={`/products/${product.id}`}
                    >
                      <ProductImage>
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <PlaceholderImage>🍺</PlaceholderImage>
                        )}
                      </ProductImage>
                      <ProductInfo>
                        <ProductName>{product.name}</ProductName>
                        {(product.brand || product.volume) && (
                          <ProductMeta>
                            {product.brand && <span>{product.brand}</span>}
                            {product.brand && product.volume && (
                              <span> • </span>
                            )}
                            {product.volume && <span>{product.volume}</span>}
                          </ProductMeta>
                        )}
                        {product.category && (
                          <Badge>{product.category.name}</Badge>
                        )}
                        <ProductPrice>
                          {formatPrice(product.price)}
                        </ProductPrice>
                      </ProductInfo>
                    </ProductCard>
                  ))}
                </ProductGrid>

                {/* Pagination */}
                {productsData && productsData.totalPages > 1 && (
                  <PaginationWrapper>
                    <PaginationButton
                      disabled={queryParams.page === 1}
                      onClick={() =>
                        handlePageChange((queryParams.page || 1) - 1)
                      }
                    >
                      ‹ Önceki
                    </PaginationButton>

                    {Array.from(
                      { length: productsData.totalPages },
                      (_, i) => i + 1
                    )
                      .filter((page) => {
                        const current = queryParams.page || 1;
                        return (
                          page === 1 ||
                          page === productsData.totalPages ||
                          (page >= current - 2 && page <= current + 2)
                        );
                      })
                      .map((page, index, arr) => (
                        <React.Fragment key={page}>
                          {index > 0 && arr[index - 1] !== page - 1 && (
                            <PaginationDots>...</PaginationDots>
                          )}
                          <PaginationButton
                            $active={page === (queryParams.page || 1)}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationButton>
                        </React.Fragment>
                      ))}

                    <PaginationButton
                      disabled={
                        (queryParams.page || 1) >= productsData.totalPages
                      }
                      onClick={() =>
                        handlePageChange((queryParams.page || 1) + 1)
                      }
                    >
                      Sonraki ›
                    </PaginationButton>
                  </PaginationWrapper>
                )}
              </>
            )}
          </ProductsArea>
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
};

export default ProductsPage;

// Styled Components
const PageWrapper = styled.div`
  padding: ${theme.spacing.section} 0;
  min-height: calc(100vh - 200px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionMobile} 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const MobileFilterButton = styled.button`
  display: none;
  background-color: ${theme.colors.bgCard};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FilterPanel = styled.aside<{ $isOpen: boolean }>`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  height: fit-content;
  position: sticky;
  top: 100px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1500;
    border-radius: 0;
    overflow-y: auto;
    transform: ${(props) =>
      props.$isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform ${theme.transitions.normal};
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const CategoryItem = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  text-align: left;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  color: ${(props) =>
    props.$active ? theme.colors.primary : theme.colors.textSecondary};
  background-color: ${(props) =>
    props.$active ? theme.colors.primaryLight : "transparent"};
  transition: all ${theme.transitions.normal};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
  }
`;

const CategoryCount = styled.span`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.textMuted};
`;

const MobileFilterClose = styled.button`
  display: none;
  width: 100%;
  background-color: ${theme.colors.primary};
  color: #000;
  border: none;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.bold};
  cursor: pointer;
  margin-top: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

const ProductsArea = styled.div``;

const SearchSortBar = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SearchInput = styled(FormInput)`
  flex: 1;
`;

const SortSelect = styled(FormSelect)`
  width: 240px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const ResultCount = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.textMuted};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${theme.spacing.lg};
`;

const SkeletonCard = styled.div`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
`;

const SkeletonContent = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ProductCard = styled(Link)`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  text-decoration: none;
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary};
  }
`;

const ProductImage = styled.div`
  position: relative;
  height: 180px;
  background-color: ${theme.colors.bgDark};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  font-size: 64px;
  opacity: 0.3;
`;

const ProductInfo = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const ProductName = styled.h3`
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0;
  line-height: 1.3;
`;

const ProductMeta = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.textMuted};
`;

const ProductPrice = styled.div`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing.xs};
`;

const PaginationDots = styled.span`
  color: ${theme.colors.textMuted};
  padding: 0 ${theme.spacing.xs};
`;
