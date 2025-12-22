import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createGlobalStyle } from "styled-components";
import { AuthProvider } from "./features/auth";
import { ToastProvider } from "./components/common/Toast";
import { MainLayout } from "./components/layout";
import { ProtectedRoute, GuestRoute } from "./routes";
import { theme } from "./styles/theme";

// Pages
import TekelLandingPage from "./TekelLandingPage";
import { ProductsPage, ProductDetailPage } from "./features/products";
import { LoginPage } from "./features/auth";
import {
  DashboardLayout,
  DashboardSummary,
  DashboardProducts,
  DashboardCategories,
  DashboardStock,
  DashboardSiteSettings,
} from "./features/dashboard";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.bgDarkest};
    color: ${theme.colors.textPrimary};
  }

  html {
    scroll-behavior: smooth;
  }

  a {
    color: inherit;
  }

  button {
    font-family: inherit;
  }
`;

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <GlobalStyle />
            <Routes>
              {/* Home page - uses its own layout */}
              <Route path="/" element={<TekelLandingPage />} />

              {/* Admin login route - no layout, clean page */}
              <Route
                path="/admin/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />

              {/* Routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Protected Dashboard routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardSummary />} />
                  <Route path="products" element={<DashboardProducts />} />
                  <Route path="categories" element={<DashboardCategories />} />
                  <Route path="stock" element={<DashboardStock />} />
                  <Route path="site-settings" element={<DashboardSiteSettings />} />
                </Route>
              </Route>

              {/* 404 - redirect to home */}
              <Route path="*" element={<TekelLandingPage />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
