import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth";
import { LoadingWrapper, Spinner } from "../styles";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("Admin" | "Manager" | "User")[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/admin/login",
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Spinner $size="48px" />
      </LoadingWrapper>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Backend roles[] array olarak dönüyor
  if (allowedRoles && user) {
    const userRoles = user.roles || [];
    const hasAllowedRole = allowedRoles.some((role) =>
      userRoles.includes(role)
    );
    if (!hasAllowedRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isLoading, isAuthenticated, isAdmin, isManager } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Spinner $size="48px" />
      </LoadingWrapper>
    );
  }

  if (isAuthenticated) {
    // Admin ve Manager her zaman dashboard'a gider
    if (isAdmin || isManager) {
      return <Navigate to="/dashboard" replace />;
    }

    // Normal kullanıcılar için önceki sayfa veya products
    const from = (location.state as { from?: Location })?.from;
    if (from) {
      return <Navigate to={from.pathname} replace />;
    }

    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
