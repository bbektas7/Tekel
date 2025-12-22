import React, { createContext, useContext, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../../styles/theme";
import type { ToastMessage } from "../../types";

interface ToastContextType {
  showToast: (type: ToastMessage["type"], message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (type: ToastMessage["type"], message: string) => {
      const id = Math.random().toString(36).substring(7);
      const toast: ToastMessage = { id, type, message };

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    success: (message) => showToast("success", message),
    error: (message) => showToast("error", message),
    info: (message) => showToast("info", message),
    warning: (message) => showToast("warning", message),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            $type={toast.type}
            onClick={() => removeToast(toast.id)}
          >
            <ToastIcon>{getIcon(toast.type)}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

const getIcon = (type: ToastMessage["type"]): string => {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✕";
    case "warning":
      return "⚠";
    case "info":
      return "ℹ";
    default:
      return "ℹ";
  }
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Toast = styled.div<{ $type: ToastMessage["type"] }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${(props) => {
    switch (props.$type) {
      case "success":
        return "rgba(34, 197, 94, 0.95)";
      case "error":
        return "rgba(239, 68, 68, 0.95)";
      case "warning":
        return "rgba(245, 158, 11, 0.95)";
      case "info":
        return "rgba(59, 130, 246, 0.95)";
      default:
        return theme.colors.bgCard;
    }
  }};
  color: #ffffff;
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  cursor: pointer;
  animation: ${slideIn} 0.3s ease-out;
  max-width: 350px;
  min-width: 250px;
`;

const ToastIcon = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ToastMessage = styled.span`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;

export default ToastProvider;
