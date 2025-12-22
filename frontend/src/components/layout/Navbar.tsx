import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { useAuth } from "../../features/auth";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isManager, logout } = useAuth();
  const location = useLocation();

  // Admin veya Manager kontrolü - hem isAdmin/isManager hem de user.role'den kontrol et
  const showAdminPanel =
    isAdmin || isManager || user?.role === "Admin" || user?.role === "Manager";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <TopBar>
        <Container>
          <TopBarContent>
            <TopBarLeft>
              <EmailLink href="mailto:info@adotekel.com">
                ✉️ info@adotekel.com
              </EmailLink>
            </TopBarLeft>
            <TopBarRight>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <InstagramIcon>IG</InstagramIcon>
              </SocialLink>
            </TopBarRight>
          </TopBarContent>
        </Container>
      </TopBar>

      {/* Header / Navbar */}
      <Header>
        <Container>
          <HeaderContent>
            <Logo to="/">
              <LogoIcon>🛢️</LogoIcon>
              <LogoText>
                <LogoTitle>ADO</LogoTitle>
                <LogoSubtitle>Tekel & Tobacco</LogoSubtitle>
              </LogoText>
            </Logo>

            <HamburgerButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <HamburgerLine $isOpen={mobileMenuOpen} />
              <HamburgerLine $isOpen={mobileMenuOpen} />
              <HamburgerLine $isOpen={mobileMenuOpen} />
            </HamburgerButton>

            <Nav $isOpen={mobileMenuOpen}>
              <NavLinkStyled to="/" onClick={() => setMobileMenuOpen(false)}>
                Ana Sayfa
              </NavLinkStyled>
              <NavLinkStyled
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ürünler
              </NavLinkStyled>
              <NavButton onClick={() => scrollToSection("about")}>
                Hakkımızda
              </NavButton>
              <NavButton onClick={() => scrollToSection("contact")}>
                İletişim
              </NavButton>

              {showAdminPanel && (
                <AdminNavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚙️ Admin Panel
                </AdminNavLink>
              )}

              {isAuthenticated && (
                <AuthSection>
                  <UserInfo>
                    <UserName>{user?.displayName || user?.name}</UserName>
                    <UserRole>{user?.roles?.join(", ") || user?.role}</UserRole>
                  </UserInfo>
                  <LogoutButton onClick={handleLogout}>Çıkış</LogoutButton>
                </AuthSection>
              )}
            </Nav>
          </HeaderContent>
        </Container>
      </Header>
    </>
  );
};

export default Navbar;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const TopBar = styled.div`
  background-color: ${theme.colors.bgDark};
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid ${theme.colors.borderLight};

  @media (max-width: 768px) {
    display: none;
  }
`;

const TopBarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopBarLeft = styled.div``;
const TopBarRight = styled.div``;

const EmailLink = styled.a`
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const SocialLink = styled.a`
  text-decoration: none;
`;

const InstagramIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: ${theme.colors.primary};
  color: #000;
  border-radius: 50%;
  font-weight: bold;
  font-size: 12px;
  transition: transform ${theme.transitions.normal};

  &:hover {
    transform: scale(1.1);
  }
`;

const Header = styled.header`
  background-color: #000000;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${theme.shadows.header};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
`;

const LogoIcon = styled.div`
  font-size: 36px;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const LogoTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1px;
  color: ${theme.colors.primary};
`;

const LogoSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  letter-spacing: 0.5px;
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const HamburgerLine = styled.span<{ $isOpen: boolean }>`
  width: 25px;
  height: 3px;
  background-color: ${theme.colors.primary};
  transition: all ${theme.transitions.normal};
  border-radius: 2px;

  &:nth-child(1) {
    transform: ${(props) =>
      props.$isOpen ? "rotate(45deg) translate(7px, 7px)" : "none"};
  }

  &:nth-child(2) {
    opacity: ${(props) => (props.$isOpen ? "0" : "1")};
  }

  &:nth-child(3) {
    transform: ${(props) =>
      props.$isOpen ? "rotate(-45deg) translate(7px, -7px)" : "none"};
  }
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 1024px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: #000000;
    flex-direction: column;
    padding: 24px;
    gap: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    transform: ${(props) =>
      props.$isOpen ? "translateY(0)" : "translateY(-150%)"};
    transition: transform ${theme.transitions.normal} ease-in-out;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }
`;

const navLinkStyles = `
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color ${theme.transitions.normal};

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${theme.colors.primary};
    transition: width ${theme.transitions.normal};
  }

  &:hover {
    color: ${theme.colors.primary};

    &::after {
      width: 100%;
    }
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    width: 100%;
    text-align: center;
    padding: 12px 0;

    &::after {
      display: none;
    }
  }
`;

const NavLinkStyled = styled(Link)`
  ${navLinkStyles}
`;

const AdminNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: ${theme.colors.primary};
  color: #000;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  transition: all ${theme.transitions.normal};

  &:hover {
    background-color: ${theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
  }
`;

const NavButton = styled.button`
  ${navLinkStyles}
  background: none;
  border: none;
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid ${theme.colors.border};

  @media (max-width: 1024px) {
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid ${theme.colors.border};
    padding-top: 16px;
    margin-top: 8px;
    width: 100%;
    justify-content: center;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 1024px) {
    align-items: center;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const UserRole = styled.span`
  font-size: 11px;
  color: ${theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: ${theme.colors.textMuted};
  border: 1px solid ${theme.colors.border};
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    border-color: ${theme.colors.error};
    color: ${theme.colors.error};
  }
`;

const LoginLink = styled(Link)`
  background-color: ${theme.colors.primary};
  color: #000000;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  transition: all ${theme.transitions.normal};

  &:hover {
    background-color: ${theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`;
