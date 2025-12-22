import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "./AuthContext";
import { useToast } from "../../components/common/Toast";
import {
  Container,
  FormGroup,
  FormLabel,
  FormInput,
  PrimaryButton,
  Checkbox,
  Spinner,
} from "../../styles";
import { theme } from "../../styles/theme";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { error: showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = await login({ email, password, rememberMe });

      // Debug log
      console.log("🔐 Login response:", user);
      console.log("🔐 User roles:", user.roles);

      // Admin ve Manager her zaman dashboard'a yönlendirilir
      // Backend roles[] array olarak dönüyor
      const userRoles = user.roles || [];
      const isAdminOrManager =
        userRoles.includes("Admin") || userRoles.includes("Manager");
      console.log("🔐 Is Admin/Manager:", isAdminOrManager);

      if (isAdminOrManager) {
        console.log("🔐 Redirecting to /dashboard");
        navigate("/dashboard");
      } else {
        // Normal kullanıcılar için önceki sayfa veya products
        const from = (location.state as { from?: Location })?.from?.pathname;
        console.log("🔐 Redirecting to:", from || "/products");
        navigate(from || "/products");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <LoginContainer>
          <LoginCard>
            <LogoSection>
              <LogoIcon>🛢️</LogoIcon>
              <LogoTitle>ADO Tekel</LogoTitle>
              <LogoSubtitle>Bayi Giriş Paneli</LogoSubtitle>
            </LogoSection>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>E-posta</FormLabel>
                <FormInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  autoComplete="email"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Şifre</FormLabel>
                <FormInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </FormGroup>

              <RememberRow>
                <Checkbox>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Beni hatırla
                </Checkbox>
                <ForgotLink href="#">Şifremi unuttum</ForgotLink>
              </RememberRow>

              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner $size="20px" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </SubmitButton>
            </Form>

            <BackToHome to="/">← Ana Sayfaya Dön</BackToHome>
          </LoginCard>
        </LoginContainer>
      </Container>
    </PageWrapper>
  );
};

export default LoginPage;

// Styled Components
const PageWrapper = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: ${theme.spacing.section} 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl} 0;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LoginCard = styled.div`
  background-color: ${theme.colors.bgCard};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.xxl};
  width: 100%;
  max-width: 420px;
  box-shadow: ${theme.shadows.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl};
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const LogoIcon = styled.div`
  font-size: 56px;
  margin-bottom: ${theme.spacing.sm};
`;

const LogoTitle = styled.h1`
  font-size: ${theme.typography.sizes.xxl};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.primary};
  margin: 0;
`;

const LogoSubtitle = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textMuted};
  margin: ${theme.spacing.xs} 0 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const RememberRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ForgotLink = styled.a`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.primary};
  text-decoration: none;
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  text-align: center;
`;

const SubmitButton = styled(PrimaryButton)`
  width: 100%;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.sizes.md};
`;

const BackToHome = styled(Link)`
  display: block;
  text-align: center;
  margin-top: ${theme.spacing.xl};
  color: ${theme.colors.textMuted};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primary};
  }
`;
