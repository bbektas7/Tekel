// ==================== USER & AUTH ====================
export type UserRole = "Admin" | "Manager" | "User";

export interface User {
  id: string;
  email: string;
  displayName: string;
  name?: string; // fallback
  phone?: string | null;
  roles: UserRole[];
  role?: UserRole; // fallback for single role
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ==================== CATEGORY ====================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

// ==================== PRODUCT ====================
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: string;
  category?: Category;
  brand?: string;
  volume?: string;
  imageUrl?: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsQueryParams {
  categoryId?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: "priceAsc" | "priceDesc" | "newest" | "nameAsc";
  page?: number;
  pageSize?: number;
}

export interface ProductsResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  categoryId: string;
  brand?: string;
  volume?: string;
  imageUrl?: string;
  stockQuantity: number;
  isActive?: boolean;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

// ==================== STOCK ====================
export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  quantityDelta: number;
  reason: string;
  note?: string;
  createdAt: string;
  createdBy?: string;
}

export interface StockMovementsQueryParams {
  productId?: string;
  page?: number;
  pageSize?: number;
}

export interface StockMovementsResponse {
  items: StockMovement[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StockAdjustmentPayload {
  quantityDelta: number;
  reason: string;
  note?: string;
}

// ==================== ADMIN SUMMARY ====================
export interface AdminSummary {
  totalProducts: number;
  totalCategories: number;
  lowStockCount: number;
  outOfStockCount: number;
  last7DaysStockMovementsCount: number;
}

// ==================== UI TYPES ====================
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

// ==================== SITE SETTINGS ====================
export interface HeroSlide {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface AboutInfo {
  aboutTitle: string;
  aboutDescription: string;
  features: AboutFeature[];
}

export interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Region {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export interface SiteSettings {
  heroSlides: HeroSlide[];
  aboutInfo: AboutInfo;
  regions: Region[];
  contactInfo: ContactInfo;
  faqs: FaqItem[];
}

export interface UpdateHeroSlidesPayload {
  slides: Omit<HeroSlide, "id">[];
}

export interface UpdateAboutInfoPayload {
  aboutTitle: string;
  aboutDescription: string;
  features: AboutFeature[];
}

export interface UpdateRegionsPayload {
  regions: Omit<Region, "id">[];
}

export interface UpdateContactInfoPayload {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
}

export interface UpdateFaqsPayload {
  faqs: Omit<FaqItem, "id">[];
}
