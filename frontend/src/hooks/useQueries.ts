import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  categoriesApi,
  productsApi,
  adminApi,
  siteSettingsApi,
} from "../api";
import type {
  User,
  ProductsQueryParams,
  StockMovementsQueryParams,
  LoginPayload,
  CreateProductPayload,
  UpdateProductPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  StockAdjustmentPayload,
  UpdateHeroSlidesPayload,
  UpdateAboutInfoPayload,
  UpdateRegionsPayload,
  UpdateContactInfoPayload,
  UpdateFaqsPayload,
} from "../types";

// Query Keys
export const queryKeys = {
  // Auth
  me: ["auth", "me"] as const,

  // Categories
  categories: ["categories"] as const,

  // Products
  products: (params: ProductsQueryParams) => ["products", params] as const,
  product: (id: string) => ["products", id] as const,

  // Admin
  adminSummary: ["admin", "summary"] as const,
  adminProducts: (params: ProductsQueryParams) =>
    ["admin", "products", params] as const,
  stockMovements: (params: StockMovementsQueryParams) =>
    ["admin", "stock-movements", params] as const,

  // Site Settings
  siteSettings: ["site-settings"] as const,
  heroSlides: ["site-settings", "hero-slides"] as const,
  aboutInfo: ["site-settings", "about"] as const,
  regions: ["site-settings", "regions"] as const,
  contactInfo: ["site-settings", "contact"] as const,
  faqs: ["site-settings", "faqs"] as const,

  // Admin Site Settings (includes inactive items)
  adminSiteSettings: ["admin", "site-settings"] as const,
};

// ==================== AUTH HOOKS ====================
export const useMeQuery = () => {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (user: User) => {
      queryClient.setQueryData(queryKeys.me, user);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.me, null);
      queryClient.invalidateQueries();
    },
  });
};

// ==================== CATEGORIES HOOKS ====================
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ==================== PRODUCTS HOOKS ====================
export const useProductsQuery = (params: ProductsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => productsApi.getAll(params),
  });
};

export const useProductQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

// ==================== ADMIN HOOKS ====================
export const useAdminSummaryQuery = () => {
  return useQuery({
    queryKey: queryKeys.adminSummary,
    queryFn: adminApi.getSummary,
  });
};

export const useAdminProductsQuery = (params: ProductsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.adminProducts(params),
    queryFn: () => adminApi.getProducts(params),
  });
};

// Category mutations
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      adminApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSummary });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => adminApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSummary });
    },
  });
};

// Product mutations
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      adminApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSummary });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => adminApi.updateProduct(id, payload),
    onSuccess: (
      _: unknown,
      variables: { id: string; payload: UpdateProductPayload }
    ) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.id),
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSummary });
    },
  });
};

// Stock mutations
export const useAdjustStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: StockAdjustmentPayload;
    }) => adminApi.adjustStock(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};

export const useStockMovementsQuery = (params: StockMovementsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.stockMovements(params),
    queryFn: () => adminApi.getStockMovements(params),
  });
};

// ==================== SITE SETTINGS HOOKS ====================
export const useSiteSettingsQuery = () => {
  return useQuery({
    queryKey: queryKeys.siteSettings,
    queryFn: siteSettingsApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Admin hook - returns all items including inactive ones
export const useAdminSiteSettingsQuery = () => {
  return useQuery({
    queryKey: queryKeys.adminSiteSettings,
    queryFn: adminApi.getSiteSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHeroSlidesQuery = () => {
  return useQuery({
    queryKey: queryKeys.heroSlides,
    queryFn: siteSettingsApi.getHeroSlides,
    staleTime: 10 * 60 * 1000,
  });
};

export const useAboutInfoQuery = () => {
  return useQuery({
    queryKey: queryKeys.aboutInfo,
    queryFn: siteSettingsApi.getAboutInfo,
    staleTime: 10 * 60 * 1000,
  });
};

export const useRegionsQuery = () => {
  return useQuery({
    queryKey: queryKeys.regions,
    queryFn: siteSettingsApi.getRegions,
    staleTime: 10 * 60 * 1000,
  });
};

export const useContactInfoQuery = () => {
  return useQuery({
    queryKey: queryKeys.contactInfo,
    queryFn: siteSettingsApi.getContactInfo,
    staleTime: 10 * 60 * 1000,
  });
};

export const useFaqsQuery = () => {
  return useQuery({
    queryKey: queryKeys.faqs,
    queryFn: siteSettingsApi.getFaqs,
    staleTime: 10 * 60 * 1000,
  });
};

// ==================== ADMIN SITE SETTINGS MUTATIONS ====================
export const useUpdateHeroSlidesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateHeroSlidesPayload) =>
      adminApi.updateHeroSlides(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.heroSlides });
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSiteSettings });
    },
  });
};

export const useUpdateAboutInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAboutInfoPayload) =>
      adminApi.updateAboutInfo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aboutInfo });
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSiteSettings });
    },
  });
};

export const useUpdateRegionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRegionsPayload) =>
      adminApi.updateRegions(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.regions });
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSiteSettings });
    },
  });
};

export const useUpdateContactInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContactInfoPayload) =>
      adminApi.updateContactInfo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactInfo });
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSiteSettings });
    },
  });
};

export const useUpdateFaqsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFaqsPayload) => adminApi.updateFaqs(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs });
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSiteSettings });
    },
  });
};
