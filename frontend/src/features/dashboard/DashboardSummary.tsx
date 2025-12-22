import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAdminSummaryQuery } from "../../hooks";
import { Card, PageTitle, Skeleton } from "../../styles";
import { theme } from "../../styles/theme";

const DashboardSummary: React.FC = () => {
  const { data: summary, isLoading, error } = useAdminSummaryQuery();

  if (isLoading) {
    return (
      <div>
        <PageTitle>Dashboard Özeti</PageTitle>
        <SummaryGrid>
          {Array.from({ length: 5 }).map((_, i) => (
            <SummaryCard key={i}>
              <Skeleton $height="24px" $width="60px" />
              <Skeleton $height="40px" $width="80px" />
              <Skeleton $height="16px" $width="100px" />
            </SummaryCard>
          ))}
        </SummaryGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageTitle>Dashboard Özeti</PageTitle>
        <ErrorCard>
          <p>Veriler yüklenirken bir hata oluştu.</p>
        </ErrorCard>
      </div>
    );
  }

  const summaryCards = [
    {
      icon: "📦",
      label: "Toplam Ürün",
      value: summary?.totalProducts || 0,
      color: theme.colors.primary,
    },
    {
      icon: "📁",
      label: "Kategori",
      value: summary?.totalCategories || 0,
      color: theme.colors.info,
    },
    {
      icon: "⚠️",
      label: "Düşük Stok",
      value: summary?.lowStockCount || 0,
      color: theme.colors.warning,
    },
    {
      icon: "❌",
      label: "Stokta Yok",
      value: summary?.outOfStockCount || 0,
      color: theme.colors.error,
    },
    {
      icon: "📈",
      label: "Son 7 Gün Hareket",
      value: summary?.last7DaysStockMovementsCount || 0,
      color: theme.colors.success,
    },
  ];

  return (
    <div>
      <PageTitle>Dashboard Özeti</PageTitle>

      <SummaryGrid>
        {summaryCards.map((card, index) => (
          <SummaryCard key={index}>
            <CardIcon>{card.icon}</CardIcon>
            <CardValue $color={card.color}>{card.value}</CardValue>
            <CardLabel>{card.label}</CardLabel>
          </SummaryCard>
        ))}
      </SummaryGrid>

      <SectionTitle>Hızlı İşlemler</SectionTitle>
      <QuickActionsGrid>
        <QuickActionCard to="/dashboard/products">
          <ActionIcon>➕</ActionIcon>
          <ActionText>Yeni Ürün Ekle</ActionText>
        </QuickActionCard>
        <QuickActionCard to="/dashboard/categories">
          <ActionIcon>📁</ActionIcon>
          <ActionText>Kategori Yönet</ActionText>
        </QuickActionCard>
        <QuickActionCard to="/dashboard/stock">
          <ActionIcon>📊</ActionIcon>
          <ActionText>Stok Ayarla</ActionText>
        </QuickActionCard>
      </QuickActionsGrid>
    </div>
  );
};

export default DashboardSummary;

// Styled Components

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
`;

const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${theme.spacing.xl};
`;

const CardIcon = styled.span`
  font-size: 32px;
  margin-bottom: ${theme.spacing.sm};
`;

const CardValue = styled.div<{ $color: string }>`
  font-size: 36px;
  font-weight: ${theme.typography.weights.black};
  color: ${(props) => props.$color};
  line-height: 1;
  margin-bottom: ${theme.spacing.xs};
`;

const CardLabel = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.textMuted};
  font-weight: ${theme.typography.weights.medium};
`;

const ErrorCard = styled(Card)`
  text-align: center;
  color: ${theme.colors.error};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.lg} 0;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const QuickActionCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  background-color: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  text-decoration: none;
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.span`
  font-size: 28px;
`;

const ActionText = styled.span`
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.textPrimary};
`;
