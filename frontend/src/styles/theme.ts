// Theme tokens matching the existing TekelLandingPage design
export const theme = {
  colors: {
    // Primary
    primary: "#ffc107",
    primaryHover: "#ffca28",
    primaryLight: "rgba(255, 193, 7, 0.1)",
    primaryShadow: "rgba(255, 193, 7, 0.3)",

    // Backgrounds
    bgDarkest: "#050505",
    bgDark: "#0b0b0f",
    bgCard: "#151517",
    bgInput: "#151517",

    // Borders
    border: "#2a2a2a",
    borderLight: "#1a1a1a",

    // Text
    textPrimary: "#ffffff",
    textSecondary: "#cccccc",
    textMuted: "#999999",
    textDark: "#666666",

    // Status
    success: "#25d366",
    successHover: "#22c55e",
    error: "#ef4444",
    errorHover: "#dc2626",
    warning: "#f59e0b",
    info: "#3b82f6",

    // Stock Status
    inStock: "#22c55e",
    lowStock: "#f59e0b",
    outOfStock: "#ef4444",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    section: "80px",
    sectionMobile: "60px",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "50px",
    circle: "50%",
  },

  shadows: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.3)",
    md: "0 4px 10px rgba(0, 0, 0, 0.3)",
    lg: "0 8px 20px rgba(0, 0, 0, 0.5)",
    primary: "0 4px 15px rgba(255, 193, 7, 0.3)",
    primaryHover: "0 6px 20px rgba(255, 193, 7, 0.4)",
    header: "0 2px 10px rgba(0, 0, 0, 0.5)",
  },

  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,

    sizes: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      xxl: "24px",
      heading: "32px",
      heroTitle: "42px",
    },

    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
  },

  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1200px",
  },

  transitions: {
    fast: "0.2s",
    normal: "0.3s",
    slow: "0.5s",
  },

  container: {
    maxWidth: "1200px",
    padding: "20px",
    paddingMobile: "16px",
  },
};

export type Theme = typeof theme;
export default theme;
