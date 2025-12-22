import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useProductQuery } from "../../hooks";
import {
  Container,
  Badge,
  StockBadge,
  LoadingWrapper,
  Spinner,
  SecondaryButton,
} from "../../styles";
import { theme } from "../../styles/theme";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProductQuery(id || "");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  const getStockText = (quantity: number) => {
    if (quantity === 0) return "Stokta Yok";
    if (quantity <= 10) return `Son ${quantity} adet`;
    return "Stokta Var";
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingWrapper>
            <Spinner $size="48px" />
          </LoadingWrapper>
        </Container>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <Container>
          <ErrorWrapper>
            <ErrorIcon>😕</ErrorIcon>
            <ErrorTitle>Ürün Bulunamadı</ErrorTitle>
            <ErrorText>
              Aradığınız ürün bulunamadı veya kaldırılmış olabilir.
            </ErrorText>
            <SecondaryButton onClick={() => navigate("/products")}>
              ← Ürünlere Dön
            </SecondaryButton>
          </ErrorWrapper>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <BackLink to="/products">← Ürünlere Dön</BackLink>

        <ProductContainer>
          <ImageSection>
            {product.imageUrl ? (
              <ProductImage src={product.imageUrl} alt={product.name} />
            ) : (
              <PlaceholderImage>
                <span>🍺</span>
              </PlaceholderImage>
            )}
          </ImageSection>

          <InfoSection>
            {product.category && <Badge>{product.category.name}</Badge>}

            <ProductName>{product.name}</ProductName>

            {(product.brand || product.volume) && (
              <ProductMeta>
                {product.brand && (
                  <MetaItem>
                    <strong>Marka:</strong> {product.brand}
                  </MetaItem>
                )}
                {product.volume && (
                  <MetaItem>
                    <strong>Hacim:</strong> {product.volume}
                  </MetaItem>
                )}
              </ProductMeta>
            )}

            <PriceSection>
              <Price>{formatPrice(product.price)}</Price>
              <StockStatus>
                <StockBadge $quantity={product.stockQuantity}>
                  {getStockText(product.stockQuantity)}
                </StockBadge>
              </StockStatus>
            </PriceSection>

            {product.description && (
              <Description>
                <DescriptionTitle>Ürün Açıklaması</DescriptionTitle>
                <DescriptionText>{product.description}</DescriptionText>
              </Description>
            )}

            <ContactInfo>
              <ContactTitle>Sipariş Vermek İçin</ContactTitle>
              <ContactText>
                WhatsApp veya telefon üzerinden sipariş verebilirsiniz.
              </ContactText>
              <WhatsAppButton
                href={`https://wa.me/905469549897?text=Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WhatsApp ile İletişime Geç
              </WhatsAppButton>
            </ContactInfo>
          </InfoSection>
        </ProductContainer>
      </Container>
    </PageWrapper>
  );
};

export default ProductDetailPage;

// Styled Components
const PageWrapper = styled.div`
  padding: ${theme.spacing.section} 0;
  min-height: calc(100vh - 200px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sectionMobile} 0;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.textMuted};
  text-decoration: none;
  font-size: ${theme.typography.sizes.md};
  margin-bottom: ${theme.spacing.xl};
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const ImageSection = styled.div`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.bgDark};

  span {
    font-size: 120px;
    opacity: 0.3;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ProductName = styled.h1`
  font-size: ${theme.typography.sizes.heading};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.textPrimary};
  margin: 0;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xxl};
  }
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const MetaItem = styled.span`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textSecondary};

  strong {
    color: ${theme.colors.textMuted};
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg} 0;
  border-top: 1px solid ${theme.colors.border};
  border-bottom: 1px solid ${theme.colors.border};
  margin: ${theme.spacing.md} 0;
`;

const Price = styled.div`
  font-size: 36px;
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.primary};
`;

const StockStatus = styled.div``;

const Description = styled.div`
  margin-top: ${theme.spacing.md};
`;

const DescriptionTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const DescriptionText = styled.p`
  font-size: ${theme.typography.sizes.md};
  line-height: 1.7;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

const ContactInfo = styled.div`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  margin-top: ${theme.spacing.lg};
`;

const ContactTitle = styled.h4`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const ContactText = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const WhatsAppButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background-color: #25d366;
  color: #ffffff;
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.md};
  transition: all ${theme.transitions.normal};

  &:hover {
    background-color: #22c55e;
    transform: translateY(-2px);
  }
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.section};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 80px;
  margin-bottom: ${theme.spacing.lg};
`;

const ErrorTitle = styled.h2`
  font-size: ${theme.typography.sizes.xxl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const ErrorText = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textMuted};
  margin: 0 0 ${theme.spacing.xl} 0;
`;
