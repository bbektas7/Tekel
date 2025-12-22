import React, { createContext, useContext, useCallback } from "react";
import { useMeQuery, useLoginMutation, useLogoutMutation } from "../../hooks";
import type { User, LoginPayload } from "../../types";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: user, isLoading, refetch } = useMeQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const login = useCallback(
    async (payload: LoginPayload): Promise<User> => {
      return loginMutation.mutateAsync(payload);
    },
    [loginMutation]
  );

  const logout = useCallback(async (): Promise<void> => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const isAuthenticated = !!user;
  // roles array'den kontrol et (backend roles[] olarak dönüyor)
  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes("Admin");
  const isManager = userRoles.includes("Manager");

  // Debug: role kontrolü
  if (user) {
    console.log(
      "🔐 User Roles:",
      userRoles,
      "| isAdmin:",
      isAdmin,
      "| isManager:",
      isManager
    );
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isManager,
    login,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
