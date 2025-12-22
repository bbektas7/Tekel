import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { theme } from "../../styles/theme";

const MainLayout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <WhatsAppFloat
        href="https://wa.me/905469549897"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon>💬</WhatsAppIcon>
        <WhatsAppLabel>Whatsapp ile Sipariş</WhatsAppLabel>
      </WhatsAppFloat>
    </LayoutWrapper>
  );
};

export default MainLayout;

const LayoutWrapper = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.bgDarkest};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

const WhatsAppFloat = styled.a`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #25d366;
  color: #ffffff;
  border-radius: 50px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transition: all ${theme.transitions.normal};
  z-index: 1000;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
    font-size: 14px;
  }
`;

const WhatsAppIcon = styled.span`
  font-size: 24px;
`;

const WhatsAppLabel = styled.span`
  font-weight: 600;
  font-size: 15px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;
