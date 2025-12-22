import styled, { css, keyframes } from "styled-components";
import { theme } from "./theme";

// ==================== LAYOUT ====================
export const Container = styled.div`
  max-width: ${theme.container.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.container.padding};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.container.paddingMobile};
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.bgDarkest};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
`;

export const Section = styled.section<{ $bgAlt?: boolean }>`
  padding: ${theme.spacing.section} 0;
  background-color: ${(props) =>
    props.$bgAlt ? theme.colors.bgDark : theme.colors.bgDarkest};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionMobile} 0;
  }
`;

// ==================== TYPOGRAPHY ====================
export const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.heroTitle};
  font-weight: ${theme.typography.weights.black};
  text-align: center;
  margin: 0 0 ${theme.spacing.xxl} 0;
  color: ${theme.colors.textPrimary};
  letter-spacing: 2px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.heading};
    margin: 0 0 ${theme.spacing.xl} 0;
  }
`;

export const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes.heading};
  font-weight: ${theme.typography.weights.black};
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.textPrimary};
`;

export const AccentLine = styled.div`
  width: 80px;
  height: 4px;
  background-color: ${theme.colors.primary};
  margin: 0 auto ${theme.spacing.xxl} auto;
  border-radius: 2px;
`;

// ==================== CARDS ====================
export const Card = styled.div<{ $hoverable?: boolean }>`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  transition: all ${theme.transitions.normal};

  ${(props) =>
    props.$hoverable &&
    css`
      &:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadows.lg};
        border-color: ${theme.colors.primary};
      }
    `}
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.sizes.xxl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.md} 0;
`;

export const CardText = styled.p`
  font-size: ${theme.typography.sizes.sm};
  line-height: 1.6;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

// ==================== BUTTONS ====================
export const PrimaryButton = styled.button`
  background-color: ${theme.colors.primary};
  color: #000000;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.bold};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  box-shadow: ${theme.shadows.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.bold};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryLight};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(PrimaryButton)`
  background-color: ${theme.colors.error};
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);

  &:hover:not(:disabled) {
    background-color: ${theme.colors.errorHover};
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing.sm};
  cursor: pointer;
  color: ${theme.colors.textMuted};
  transition: color ${theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

// ==================== FORM ELEMENTS ====================
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const FormLabel = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const FormInput = styled.input`
  background-color: ${theme.colors.bgInput};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 14px ${theme.spacing.md};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textPrimary};
  transition: all ${theme.transitions.normal};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${theme.colors.textDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormTextarea = styled.textarea`
  background-color: ${theme.colors.bgInput};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 14px ${theme.spacing.md};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textPrimary};
  resize: vertical;
  font-family: inherit;
  transition: all ${theme.transitions.normal};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${theme.colors.textDark};
  }
`;

export const FormSelect = styled.select`
  background-color: ${theme.colors.bgInput};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: 14px ${theme.spacing.md};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textPrimary};
  transition: all ${theme.transitions.normal};
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primaryLight};
  }

  option {
    background-color: ${theme.colors.bgCard};
    color: ${theme.colors.textPrimary};
  }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textSecondary};

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }
`;

export const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textSecondary};

  input {
    display: none;
  }

  span {
    position: relative;
    width: 44px;
    height: 24px;
    background-color: ${theme.colors.border};
    border-radius: ${theme.borderRadius.full};
    transition: background-color ${theme.transitions.normal};

    &::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background-color: ${theme.colors.textPrimary};
      border-radius: 50%;
      transition: transform ${theme.transitions.normal};
    }
  }

  input:checked + span {
    background-color: ${theme.colors.primary};

    &::after {
      transform: translateX(20px);
    }
  }
`;

// ==================== BADGES ====================
export const Badge = styled.span<{
  $variant?: "success" | "warning" | "error" | "info" | "default";
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.semibold};
  border-radius: ${theme.borderRadius.full};

  ${(props) => {
    switch (props.$variant) {
      case "success":
        return css`
          background-color: rgba(34, 197, 94, 0.2);
          color: ${theme.colors.success};
        `;
      case "warning":
        return css`
          background-color: rgba(245, 158, 11, 0.2);
          color: ${theme.colors.warning};
        `;
      case "error":
        return css`
          background-color: rgba(239, 68, 68, 0.2);
          color: ${theme.colors.error};
        `;
      case "info":
        return css`
          background-color: rgba(59, 130, 246, 0.2);
          color: ${theme.colors.info};
        `;
      default:
        return css`
          background-color: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
        `;
    }
  }}
`;

export const StockBadge = styled(Badge)<{ $quantity: number }>`
  ${(props) => {
    if (props.$quantity === 0) {
      return css`
        background-color: rgba(239, 68, 68, 0.2);
        color: ${theme.colors.outOfStock};
      `;
    } else if (props.$quantity <= 10) {
      return css`
        background-color: rgba(245, 158, 11, 0.2);
        color: ${theme.colors.lowStock};
      `;
    } else {
      return css`
        background-color: rgba(34, 197, 94, 0.2);
        color: ${theme.colors.inStock};
      `;
    }
  }}
`;

// ==================== SKELETON LOADING ====================
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const Skeleton = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  width: ${(props) => props.$width || "100%"};
  height: ${(props) => props.$height || "20px"};
  background-color: ${theme.colors.bgCard};
  background-image: linear-gradient(
    90deg,
    ${theme.colors.bgCard} 0px,
    ${theme.colors.border} 40px,
    ${theme.colors.bgCard} 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${(props) => props.$radius || theme.borderRadius.md};
`;

export const SkeletonCard = styled(Card)`
  min-height: 200px;
`;

// ==================== EMPTY STATE ====================
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.section} ${theme.spacing.lg};
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

export const EmptyStateText = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textMuted};
  margin: 0;
`;

// ==================== GRID ====================
export const Grid = styled.div<{ $columns?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 2}, 1fr);
  gap: ${(props) => props.$gap || theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

export const FlexRow = styled.div<{
  $gap?: string;
  $align?: string;
  $justify?: string;
  $wrap?: boolean;
}>`
  display: flex;
  gap: ${(props) => props.$gap || theme.spacing.md};
  align-items: ${(props) => props.$align || "center"};
  justify-content: ${(props) => props.$justify || "flex-start"};
  flex-wrap: ${(props) => (props.$wrap ? "wrap" : "nowrap")};
`;

export const FlexColumn = styled.div<{ $gap?: string; $align?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap || theme.spacing.md};
  align-items: ${(props) => props.$align || "stretch"};
`;

// ==================== TABLE ====================
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
`;

export const TableHeader = styled.thead`
  background-color: ${theme.colors.bgDark};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};
  transition: background-color ${theme.transitions.normal};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${theme.colors.bgDark};
  }
`;

export const TableHead = styled.th`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  text-align: left;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableCell = styled.td`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textSecondary};
`;

// ==================== PAGINATION ====================
export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  min-width: 40px;
  border: 1px solid
    ${(props) => (props.$active ? theme.colors.primary : theme.colors.border)};
  background-color: ${(props) =>
    props.$active ? theme.colors.primary : "transparent"};
  color: ${(props) => (props.$active ? "#000" : theme.colors.textSecondary)};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${theme.typography.weights.medium};
  transition: all ${theme.transitions.normal};

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${(props) => (props.$active ? "#000" : theme.colors.primary)};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ==================== SPINNER ====================
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div<{ $size?: string }>`
  width: ${(props) => props.$size || "24px"};
  height: ${(props) => props.$size || "24px"};
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.section} 0;
`;
