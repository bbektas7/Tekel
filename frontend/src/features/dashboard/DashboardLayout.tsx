import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../styles";
import { theme } from "../../styles/theme";

const DashboardLayout: React.FC = () => {
  return (
    <PageWrapper>
      <Container>
        <DashboardGrid>
          <Sidebar>
            <SidebarTitle>Dashboard</SidebarTitle>
            <NavList>
              <NavItem to="/dashboard" end>
                📊 Özet
              </NavItem>
              <NavItem to="/dashboard/products">📦 Ürünler</NavItem>
              <NavItem to="/dashboard/categories">📁 Kategoriler</NavItem>
              <NavItem to="/dashboard/stock">📈 Stok Hareketleri</NavItem>
              <NavItem to="/dashboard/site-settings">🎨 Site Ayarları</NavItem>
            </NavList>
          </Sidebar>

          <MainContent>
            <Outlet />
          </MainContent>
        </DashboardGrid>
      </Container>
    </PageWrapper>
  );
};

export default DashboardLayout;

// Styled Components
const PageWrapper = styled.div`
  padding: ${theme.spacing.xl} 0 ${theme.spacing.section} 0;
  min-height: calc(100vh - 200px);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  height: fit-content;
  position: sticky;
  top: 100px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: static;
  }
`;

const SidebarTitle = styled.h2`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.lg} 0;
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.medium};
  transition: all ${theme.transitions.normal};

  &:hover {
    background-color: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
  }

  &.active {
    background-color: ${theme.colors.primary};
    color: #000;
  }
`;

const MainContent = styled.main`
  min-width: 0;
`;
