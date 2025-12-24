import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSiteSettingsQuery } from "./hooks/useQueries";
import { useAuth } from "./features/auth";

// Main Component
const TekelLandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: siteSettings } = useSiteSettingsQuery();
  const { user, isAdmin, isManager } = useAuth();

  // Admin veya Manager kontrolü
  const userRoles = user?.roles || [];
  const showAdminPanel =
    isAdmin ||
    isManager ||
    userRoles.includes("Admin") ||
    userRoles.includes("Manager") ||
    user?.role === "Admin" ||
    user?.role === "Manager";

  // Use data from API
  const heroSlides =
    siteSettings?.heroSlides
      ?.filter((s) => s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const aboutInfo = siteSettings?.aboutInfo;
  const regions =
    siteSettings?.regions
      ?.filter((r) => r.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const contactInfo = siteSettings?.contactInfo;
  const faqs =
    siteSettings?.faqs
      ?.filter((f) => f.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const currentYear = new Date().getFullYear();

  // Auto-slide for hero
  useEffect(() => {
    if (heroSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroSlides.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log({
      name: formData.get("name"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    });
    alert("Mesajınız alındı! (Demo)");
  };

  const goToSlide = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentSlide(
        (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
      );
    } else {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }
  };

  return (
    <PageWrapper>
      {/* Top Bar */}
      {contactInfo && (
        <TopBar>
          <Container>
            <TopBarContent>
              <TopBarLeft>
                <EmailLink href={`mailto:${contactInfo.email}`}>
                  ✉️ {contactInfo.email}
                </EmailLink>
              </TopBarLeft>
              <TopBarRight>
                {contactInfo.instagramUrl && (
                  <SocialLink
                    onClick={(e) => {
                      e.preventDefault();
                      const instagramUrl = contactInfo.instagramUrl;
                      if (instagramUrl) {
                        const url = instagramUrl.startsWith("http")
                          ? instagramUrl
                          : `https://${instagramUrl}`;
                        window.open(url, "_blank", "noopener,noreferrer");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <InstagramIcon>IG</InstagramIcon>
                  </SocialLink>
                )}
              </TopBarRight>
            </TopBarContent>
          </Container>
        </TopBar>
      )}

      {/* Header / Navbar */}
      <Header>
        <Container>
          <HeaderContent>
            <Logo>
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
              <NavLinkRouter
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ürünler
              </NavLinkRouter>
              <NavLink onClick={() => scrollToSection("about")}>
                Hakkımızda
              </NavLink>
              <NavLink onClick={() => scrollToSection("products")}>
                Ürün Kategorileri
              </NavLink>
              <NavLink onClick={() => scrollToSection("regions")}>
                Bölgelerimiz
              </NavLink>
              <NavLink onClick={() => scrollToSection("faq")}>S.S.S.</NavLink>
              <NavLink onClick={() => scrollToSection("contact")}>
                İletişim
              </NavLink>

              {showAdminPanel && (
                <AdminPanelLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚙️ Admin Panel
                </AdminPanelLink>
              )}
            </Nav>
          </HeaderContent>
        </Container>
      </Header>

      {/* Hero Section */}
      <Hero $backgroundImage={heroSlides[currentSlide]?.imageUrl}>
        <HeroOverlay />
        <Container>
          <HeroContent>
            <HeroTitle>
              {heroSlides[currentSlide]?.title || "ADO TEKEL"}
            </HeroTitle>
            <HeroSubtitle>
              {heroSlides[currentSlide]?.subtitle ||
                "Hızlı ve Ücretsiz Eve Sipariş"}
            </HeroSubtitle>
            <HeroButtons>
              {contactInfo && (
                <PrimaryButton
                  as="a"
                  href={`https://wa.me/${contactInfo.whatsapp
                    .replace(/\s/g, "")
                    .replace("+", "")}`}
                >
                  📱 Whatsapp ile Sipariş Ver
                </PrimaryButton>
              )}
            </HeroButtons>
            {heroSlides.length > 1 && (
              <>
                <HeroNavButton
                  $direction="left"
                  onClick={() => goToSlide("prev")}
                >
                  ‹
                </HeroNavButton>
                <HeroNavButton
                  $direction="right"
                  onClick={() => goToSlide("next")}
                >
                  ›
                </HeroNavButton>
                <HeroIndicators>
                  {heroSlides.map((_, index) => (
                    <HeroIndicator
                      key={index}
                      $isActive={index === currentSlide}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </HeroIndicators>
              </>
            )}
          </HeroContent>
        </Container>
      </Hero>

      {/* About Section */}
      {aboutInfo && (
        <Section id="about">
          <Container>
            <SectionTitle>{aboutInfo.aboutTitle}</SectionTitle>
            {aboutInfo.aboutDescription
              .split("\n\n")
              .map((paragraph, index) => (
                <AboutText key={index}>{paragraph}</AboutText>
              ))}

            <FeatureRow>
              {aboutInfo.features.map((feature, index) => (
                <FeatureItem key={index}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDesc>{feature.description}</FeatureDesc>
                </FeatureItem>
              ))}
            </FeatureRow>
          </Container>
        </Section>
      )}

      {/* Products Section */}
      <ProductsSection id="products">
        <Container>
          <SectionTitle>ÜRÜNLERİMİZ</SectionTitle>
          <AccentLine />
          <ProductGrid>
            <ProductCardLink to="/products">
              <ProductIconWrapper>
                <ProductIcon>🥤</ProductIcon>
              </ProductIconWrapper>
              <ProductTitle>Sıcak & Soğuk İçecekler</ProductTitle>
              <ProductSubtitle>
                Klasik içecekler, enerji içecekleri ve daha fazlası.
              </ProductSubtitle>
            </ProductCardLink>

            <ProductCardLink to="/products">
              <ProductIconWrapper>
                <ProductIcon>🍺</ProductIcon>
              </ProductIconWrapper>
              <ProductTitle>Tekel İçecekleri</ProductTitle>
              <ProductSubtitle>
                Bira, şarap, viski ve geniş alkol seçkisi.
              </ProductSubtitle>
            </ProductCardLink>

            <ProductCardLink to="/products">
              <ProductIconWrapper>
                <ProductIcon>🧀</ProductIcon>
              </ProductIconWrapper>
              <ProductTitle>Soğuk Mezeler</ProductTitle>
              <ProductSubtitle>
                Atıştırmalıklar ve meze çeşitleri.
              </ProductSubtitle>
            </ProductCardLink>

            <ProductCardLink to="/products">
              <ProductIconWrapper>
                <ProductIcon>🥜</ProductIcon>
              </ProductIconWrapper>
              <ProductTitle>Şarküteri ve Kuruyemiş</ProductTitle>
              <ProductSubtitle>
                Taze kuruyemişler ve şarküteri ürünleri.
              </ProductSubtitle>
            </ProductCardLink>
          </ProductGrid>
        </Container>
      </ProductsSection>

      {/* Regions Section */}
      <Section id="regions">
        <Container>
          <SectionTitle>Hizmet Verdiğimiz Bölgeler</SectionTitle>
          <RegionSubtitle>
            Buca ve çevresinde geniş servis ağımız.
          </RegionSubtitle>
          <RegionGrid>
            {regions.map((region) => (
              <RegionPill key={region.id}>{region.name}</RegionPill>
            ))}
          </RegionGrid>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="faq">
        <Container>
          <SectionTitle>Sıkça Sorulan Sorular</SectionTitle>
          <FaqContainer>
            {faqs.map((faq, index) => (
              <FaqItemWrapper key={faq.id}>
                <FaqQuestion
                  onClick={() => toggleFaq(index)}
                  $isActive={activeFaq === index}
                >
                  <span>{faq.question}</span>
                  <FaqIcon $isActive={activeFaq === index}>
                    {activeFaq === index ? "−" : "+"}
                  </FaqIcon>
                </FaqQuestion>
                <FaqAnswer $isOpen={activeFaq === index}>
                  <FaqAnswerContent>{faq.answer}</FaqAnswerContent>
                </FaqAnswer>
              </FaqItemWrapper>
            ))}
          </FaqContainer>
        </Container>
      </Section>

      {/* Terms & Blog Section */}
      <TermsBlogSection id="terms">
        <Container>
          <TermsBlogGrid>
            <TermsBlogCard>
              <CardTitle>Şartlar ve Koşullar</CardTitle>
              <CardText>
                Hizmet kullanım koşullarımız, gizlilik politikamız ve yasal
                bilgiler hakkında detaylı bilgi alın.
              </CardText>
              <CardLink href="#">Detayları Gör →</CardLink>
            </TermsBlogCard>

            <TermsBlogCard id="blog">
              <CardTitle>Blog</CardTitle>
              <CardText>
                İçecek önerileri, etkinlik haberleri ve ADO'dan güncel
                yazılarımızı okuyun.
              </CardText>
              <CardLink href="#">Son yazılarımıza göz atın →</CardLink>
            </TermsBlogCard>
          </TermsBlogGrid>
        </Container>
      </TermsBlogSection>

      {/* Footer */}
      <Footer>
        <Container>
          <FooterContent>
            <Copyright>
              © {currentYear} ADO Tekel & Tobacco. Tüm hakları saklıdır.
            </Copyright>
            <FooterLinks>
              <FooterLink href="#">KVKK</FooterLink>
              <FooterLink href="#">Çerez Politikası</FooterLink>
            </FooterLinks>
          </FooterContent>
        </Container>
      </Footer>

      {/* Floating WhatsApp Button */}
      {contactInfo && (
        <WhatsAppFloat
          href={`https://wa.me/${contactInfo.whatsapp
            .replace(/\s/g, "")
            .replace("+", "")}`}
        >
          <WhatsAppIcon>💬</WhatsAppIcon>
          <WhatsAppLabel>Whatsapp ile Sipariş</WhatsAppLabel>
        </WhatsAppFloat>
      )}
    </PageWrapper>
  );
};

export default TekelLandingPage;

// Styled Components

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #050505;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

// Top Bar
const TopBar = styled.div`
  background-color: #0b0b0f;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid #1a1a1a;

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
  color: #cccccc;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #ffc107;
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
  background-color: #ffc107;
  color: #000;
  border-radius: 50%;
  font-weight: bold;
  font-size: 12px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

// Header
const Header = styled.header`
  background-color: #000000;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
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
  color: #ffc107;
`;

const LogoSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #cccccc;
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
  background-color: #ffc107;
  transition: all 0.3s;
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
  gap: 32px;
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
    transition: transform 0.3s ease-in-out;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }
`;

const NavLink = styled.a`
  color: #cccccc;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #ffc107;
    transition: width 0.3s;
  }

  &:hover {
    color: #ffc107;

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

const NavLinkRouter = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #ffc107;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #ffc107;

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

const AdminPanelLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background-color: #ffc107;
  color: #000;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background-color: #ffca28;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
  }
`;

// Hero Section
const Hero = styled.section<{ $backgroundImage?: string }>`
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  background-image: url("${(props) =>
    props.$backgroundImage ||
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974"}");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  transition: background-image 0.5s ease-in-out;

  @media (max-width: 768px) {
    min-height: 500px;
    background-attachment: scroll;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(5, 5, 5, 0.9) 0%,
    rgba(11, 11, 15, 0.7) 100%
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  padding: 60px 0;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
    padding: 40px 0;
  }
`;

const HeroTitle = styled.h1`
  font-size: 64px;
  font-weight: 900;
  letter-spacing: 4px;
  margin: 0 0 16px 0;
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 42px;
    letter-spacing: 2px;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #ffc107;
  margin: 0 0 24px 0;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const HeroText = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #cccccc;
  margin: 0 0 32px 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const PrimaryButton = styled.button`
  background-color: #ffc107;
  color: #000000;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);

  &:hover {
    background-color: #ffca28;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SecondaryLink = styled.a`
  color: #ffc107;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s;

  &:hover {
    border-bottom-color: #ffc107;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const HeroNavButton = styled.button<{ $direction: "left" | "right" }>`
  position: fixed;
  top: 50%;
  ${(props) => (props.$direction === "left" ? "left: 20px" : "right: 20px")};
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 193, 7, 0.2);
  border: 2px solid #ffc107;
  color: #ffc107;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 100;

  &:hover {
    background-color: rgba(255, 193, 7, 0.4);
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    left: ${(props) => (props.$direction === "left" ? "10px" : "auto")};
    right: ${(props) => (props.$direction === "right" ? "10px" : "auto")};
  }
`;

const HeroIndicators = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const HeroIndicator = styled.button<{ $isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #ffc107;
  background-color: ${(props) => (props.$isActive ? "#ffc107" : "transparent")};
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;

  &:hover {
    background-color: rgba(255, 193, 7, 0.5);
  }
`;

// Sections
const Section = styled.section`
  padding: 80px 0;
  background-color: #050505;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 900;
  text-align: center;
  margin: 0 0 48px 0;
  color: #ffffff;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 32px;
    margin: 0 0 32px 0;
  }
`;

const AboutText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #cccccc;
  margin: 0 0 20px 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 15px;
    text-align: left;
  }
`;

const FeatureRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FeatureItem = styled.div`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #ffc107;
  margin: 0 0 8px 0;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  color: #999999;
  margin: 0;
`;

// Products Section
const ProductsSection = styled.section`
  padding: 80px 0;
  background-color: #0b0b0f;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const AccentLine = styled.div`
  width: 80px;
  height: 4px;
  background-color: #ffc107;
  margin: 0 auto 48px auto;
  border-radius: 2px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ProductCard = styled.div`
  background-color: #151517;
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  }
`;

const ProductCardLink = styled(Link)`
  background-color: #151517;
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-decoration: none;
  display: block;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  }
`;

const ProductIconWrapper = styled.div`
  margin-bottom: 20px;
  transition: transform 0.3s;

  ${ProductCardLink}:hover & {
    transform: scale(1.1);
  }
`;

const ProductIcon = styled.div`
  font-size: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: rgba(255, 193, 7, 0.1);
  border-radius: 50%;
  border: 2px solid #ffc107;
`;

const ProductTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
`;

const ProductSubtitle = styled.p`
  font-size: 14px;
  color: #999999;
  margin: 0;
  line-height: 1.6;
`;

// Regions Section
const RegionSubtitle = styled.p`
  text-align: center;
  font-size: 16px;
  color: #999999;
  margin: -32px 0 40px 0;
`;

const RegionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
`;

const RegionPill = styled.div`
  padding: 12px 28px;
  background-color: #151517;
  border: 2px solid #2a2a2a;
  border-radius: 50px;
  color: #cccccc;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #ffc107;
    color: #000000;
    border-color: #ffc107;
    transform: scale(1.05);
  }
`;

// FAQ Section
const FaqContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FaqItemWrapper = styled.div`
  margin-bottom: 16px;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  background-color: #0b0b0f;
`;

const FaqQuestion = styled.div<{ $isActive: boolean }>`
  padding: 20px 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => (props.$isActive ? "#ffc107" : "#ffffff")};
  transition: all 0.3s;
  background-color: ${(props) => (props.$isActive ? "#151517" : "transparent")};

  &:hover {
    color: #ffc107;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 16px 20px;
  }
`;

const FaqIcon = styled.span<{ $isActive: boolean }>`
  font-size: 28px;
  color: #ffc107;
  transition: transform 0.3s;
  transform: ${(props) => (props.$isActive ? "rotate(180deg)" : "rotate(0)")};
`;

const FaqAnswer = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const FaqAnswerContent = styled.div`
  padding: 0 24px 20px 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #cccccc;

  @media (max-width: 768px) {
    padding: 0 20px 16px 20px;
    font-size: 15px;
  }
`;

// Terms & Blog Section
const TermsBlogSection = styled.section`
  padding: 80px 0;
  background-color: #0b0b0f;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const TermsBlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const TermsBlogCard = styled.div`
  background-color: #151517;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  transition: all 0.3s;

  &:hover {
    border-color: #ffc107;
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #ffc107;
  margin: 0 0 16px 0;
`;

const CardText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #cccccc;
  margin: 0 0 24px 0;
`;

const CardLink = styled.a`
  color: #ffc107;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    color: #ffca28;
    text-decoration: underline;
  }
`;

// Contact Section
const ContactSection = styled.section`
  padding: 80px 0;
  background-color: #050505;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ContactItem = styled.div``;

const ContactLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffc107;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContactValue = styled.a`
  font-size: 18px;
  color: #ffffff;
  text-decoration: none;
  display: block;
  transition: color 0.3s;

  &:hover {
    color: #ffc107;
  }
`;

const ContactText = styled.div`
  font-size: 16px;
  color: #cccccc;
  line-height: 1.6;
`;

const WhatsAppBadge = styled.span`
  display: inline-block;
  background-color: #25d366;
  color: #ffffff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: 600;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #ffc107;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FormInput = styled.input`
  background-color: #151517;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 16px;
  color: #ffffff;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #ffc107;
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
  }

  &::placeholder {
    color: #666666;
  }
`;

const FormTextarea = styled.textarea`
  background-color: #151517;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 16px;
  color: #ffffff;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #ffc107;
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
  }

  &::placeholder {
    color: #666666;
  }
`;

const SubmitButton = styled.button`
  background-color: #ffc107;
  color: #000000;
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);

  &:hover {
    background-color: #ffca28;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
  }
`;

// Footer
const Footer = styled.footer`
  background-color: #000000;
  padding: 24px 0;
  border-top: 1px solid #1a1a1a;
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
  color: #999999;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const FooterLink = styled.a`
  font-size: 14px;
  color: #999999;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #ffc107;
  }
`;

// Floating WhatsApp Button
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
  transition: all 0.3s;
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
