import api from "./axios";
import type {
  User,
  Category,
  Product,
  ProductsResponse,
  ProductsQueryParams,
  AdminSummary,
  StockMovementsResponse,
  StockMovementsQueryParams,
  CreateProductPayload,
  UpdateProductPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  StockAdjustmentPayload,
  LoginPayload,
  SiteSettings,
  HeroSlide,
  AboutInfo,
  Region,
  ContactInfo,
  FaqItem,
  UpdateHeroSlidesPayload,
  UpdateAboutInfoPayload,
  UpdateRegionsPayload,
  UpdateContactInfoPayload,
  UpdateFaqsPayload,
} from "../types";

// ==================== AUTH ====================
export const authApi = {
  login: async (payload: LoginPayload): Promise<User> => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  me: async (): Promise<User> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

// ==================== CATEGORIES ====================
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get("/categories");
    return data;
  },
};

// ==================== PRODUCTS ====================
export const productsApi = {
  getAll: async (params: ProductsQueryParams): Promise<ProductsResponse> => {
    const { data } = await api.get("/products", { params });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
};

// ==================== ADMIN ====================
export const adminApi = {
  // Summary
  getSummary: async (): Promise<AdminSummary> => {
    const { data } = await api.get("/admin/summary");
    return data;
  },

  // Categories CRUD
  createCategory: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await api.post("/admin/categories", payload);
    return data;
  },

  updateCategory: async (
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<Category> => {
    const { data } = await api.put(`/admin/categories/${id}`, payload);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },

  // Products CRUD
  getProducts: async (
    params: ProductsQueryParams
  ): Promise<ProductsResponse> => {
    const { data } = await api.get("/products", { params });
    return data;
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await api.post("/admin/products", payload);
    return data;
  },

  updateProduct: async (
    id: string,
    payload: UpdateProductPayload
  ): Promise<Product> => {
    const { data } = await api.put(`/admin/products/${id}`, payload);
    return data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  // Stock
  adjustStock: async (
    productId: string,
    payload: StockAdjustmentPayload
  ): Promise<void> => {
    await api.patch(`/admin/products/${productId}/stock`, payload);
  },

  getStockMovements: async (
    params: StockMovementsQueryParams
  ): Promise<StockMovementsResponse> => {
    const { data } = await api.get("/admin/stock-movements", { params });
    return data;
  },

  // Site Settings
  getSiteSettings: async (): Promise<SiteSettings> => {
    const { data } = await api.get("/admin/site-settings");
    return data;
  },

  updateHeroSlides: async (
    payload: UpdateHeroSlidesPayload
  ): Promise<HeroSlide[]> => {
    const { data } = await api.put("/admin/site-settings/hero-slides", payload);
    return data;
  },

  updateAboutInfo: async (
    payload: UpdateAboutInfoPayload
  ): Promise<AboutInfo> => {
    const { data } = await api.put("/admin/site-settings/about", payload);
    return data;
  },

  updateRegions: async (payload: UpdateRegionsPayload): Promise<Region[]> => {
    const { data } = await api.put("/admin/site-settings/regions", payload);
    return data;
  },

  updateContactInfo: async (
    payload: UpdateContactInfoPayload
  ): Promise<ContactInfo> => {
    const { data } = await api.put("/admin/site-settings/contact", payload);
    return data;
  },

  updateFaqs: async (payload: UpdateFaqsPayload): Promise<FaqItem[]> => {
    const { data } = await api.put("/admin/site-settings/faqs", payload);
    return data;
  },
};

// ==================== PUBLIC SITE SETTINGS ====================
export const siteSettingsApi = {
  getAll: async (): Promise<SiteSettings> => {
    const { data } = await api.get("/site-settings");
    return data;
  },

  getHeroSlides: async (): Promise<HeroSlide[]> => {
    const { data } = await api.get("/site-settings/hero-slides");
    return data;
  },

  getAboutInfo: async (): Promise<AboutInfo> => {
    const { data } = await api.get("/site-settings/about");
    return data;
  },

  getRegions: async (): Promise<Region[]> => {
    const { data } = await api.get("/site-settings/regions");
    return data;
  },

  getContactInfo: async (): Promise<ContactInfo> => {
    const { data } = await api.get("/site-settings/contact");
    return data;
  },

  getFaqs: async (): Promise<FaqItem[]> => {
    const { data } = await api.get("/site-settings/faqs");
    return data;
  },
};
