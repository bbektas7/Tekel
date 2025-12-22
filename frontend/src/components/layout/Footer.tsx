import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { theme } from "../../styles/theme";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Container>
        <FooterContent>
          <Copyright>
            © {currentYear} ADO Tekel & Tobacco. Tüm hakları saklıdır.
          </Copyright>
          <FooterLinks>
            <FooterLink to="/privacy">KVKK</FooterLink>
            <FooterLink to="/cookies">Çerez Politikası</FooterLink>
          </FooterLinks>
        </FooterContent>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const FooterWrapper = styled.footer`
  background-color: #000000;
  padding: 24px 0;
  border-top: 1px solid ${theme.colors.borderLight};
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

const Copyright = styled.div`
  font-size: 14px;
  color: ${theme.colors.textMuted};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const FooterLink = styled(Link)`
  font-size: 14px;
  color: ${theme.colors.textMuted};
  text-decoration: none;
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primary};
  }
`;
