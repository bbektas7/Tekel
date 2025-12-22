import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import {
  useAdminSiteSettingsQuery,
  useUpdateHeroSlidesMutation,
  useUpdateAboutInfoMutation,
  useUpdateRegionsMutation,
  useUpdateContactInfoMutation,
  useUpdateFaqsMutation,
} from "../../hooks/useQueries";
import type {
  HeroSlide,
  AboutInfo,
  AboutFeature,
  Region,
  ContactInfo,
  FaqItem,
} from "../../types";

type TabType = "hero" | "about" | "regions" | "contact" | "faq";

const DashboardSiteSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const { data: siteSettings, isLoading } = useAdminSiteSettingsQuery();

  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  // About Info State
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({
    aboutTitle: "",
    aboutDescription: "",
    features: [],
  });

  // Regions State
  const [regions, setRegions] = useState<Region[]>([]);

  // Contact Info State
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    country: "",
    instagramUrl: "",
    facebookUrl: null,
    twitterUrl: null,
  });

  // FAQ State
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Mutations
  const updateHeroSlides = useUpdateHeroSlidesMutation();
  const updateAboutInfo = useUpdateAboutInfoMutation();
  const updateRegions = useUpdateRegionsMutation();
  const updateContactInfo = useUpdateContactInfoMutation();
  const updateFaqs = useUpdateFaqsMutation();

  // Initialize state from API data
  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.heroSlides) {
        setHeroSlides(siteSettings.heroSlides);
      }
      if (siteSettings.aboutInfo) {
        setAboutInfo(siteSettings.aboutInfo);
      }
      if (siteSettings.regions) {
        setRegions(siteSettings.regions);
      }
      if (siteSettings.contactInfo) {
        setContactInfo(siteSettings.contactInfo);
      }
      if (siteSettings.faqs) {
        setFaqs(siteSettings.faqs);
      }
    }
  }, [siteSettings]);

  // Hero Slides handlers
  const addHeroSlide = () => {
    setHeroSlides([
      ...heroSlides,
      {
        id: crypto.randomUUID(),
        imageUrl: "",
        title: "",
        subtitle: "",
        sortOrder: heroSlides.length + 1,
        isActive: true,
      },
    ]);
  };

  const updateHeroSlide = (
    index: number,
    field: keyof Omit<HeroSlide, "id">,
    value: string | number | boolean
  ) => {
    const updated = [...heroSlides];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlides(updated);
  };

  const removeHeroSlide = (index: number) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== index));
  };

  const saveHeroSlides = async () => {
    try {
      await updateHeroSlides.mutateAsync({ slides: heroSlides });
      alert("Hero görselleri kaydedildi!");
    } catch (error) {
      alert("Kayıt sırasında hata oluştu!");
    }
  };

  // About handlers
  const addFeature = () => {
    setAboutInfo({
      ...aboutInfo,
      features: [
        ...aboutInfo.features,
        { icon: "✨", title: "", description: "" },
      ],
    });
  };

  const updateFeature = (
    index: number,
    field: keyof AboutFeature,
    value: string
  ) => {
    const updated = [...aboutInfo.features];
    updated[index] = { ...updated[index], [field]: value };
    setAboutInfo({ ...aboutInfo, features: updated });
  };

  const removeFeature = (index: number) => {
    setAboutInfo({
      ...aboutInfo,
      features: aboutInfo.features.filter((_, i) => i !== index),
    });
  };

  const saveAboutInfo = async () => {
    try {
      await updateAboutInfo.mutateAsync(aboutInfo);
      alert("Hakkımızda bilgisi kaydedildi!");
    } catch (error) {
      alert("Kayıt sırasında hata oluştu!");
    }
  };

  // Regions handlers
  const addRegion = () => {
    setRegions([
      ...regions,
      {
        id: crypto.randomUUID(),
        name: "",
        isActive: true,
        sortOrder: regions.length + 1,
      },
    ]);
  };

  const updateRegion = (
    index: number,
    field: keyof Omit<Region, "id">,
    value: string | number | boolean
  ) => {
    const updated = [...regions];
    updated[index] = { ...updated[index], [field]: value };
    setRegions(updated);
  };

  const removeRegion = (index: number) => {
    setRegions(regions.filter((_, i) => i !== index));
  };

  const saveRegions = async () => {
    try {
      await updateRegions.mutateAsync({ regions });
      alert("Bölgeler kaydedildi!");
    } catch (error) {
      alert("Kayıt sırasında hata oluştu!");
    }
  };

  // Contact handlers
  const saveContactInfo = async () => {
    try {
      await updateContactInfo.mutateAsync(contactInfo);
      alert("İletişim bilgileri kaydedildi!");
    } catch (error) {
      alert("Kayıt sırasında hata oluştu!");
    }
  };

  // FAQ handlers
  const addFaq = () => {
    setFaqs([
      ...faqs,
      {
        id: crypto.randomUUID(),
        question: "",
        answer: "",
        sortOrder: faqs.length + 1,
        isActive: true,
      },
    ]);
  };

  const updateFaq = (
    index: number,
    field: keyof Omit<FaqItem, "id">,
    value: string | number | boolean
  ) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const saveFaqs = async () => {
    try {
      await updateFaqs.mutateAsync({ faqs });
      alert("Sık sorulan sorular kaydedildi!");
    } catch (error) {
      alert("Kayıt sırasında hata oluştu!");
    }
  };

  if (isLoading) {
    return <LoadingText>Yükleniyor...</LoadingText>;
  }

  return (
    <Wrapper>
      <PageHeader>
        <Title>🎨 Site Ayarları</Title>
        <Subtitle>Ana sayfa içeriklerini yönetin</Subtitle>
      </PageHeader>

      <TabContainer>
        <Tab
          $isActive={activeTab === "hero"}
          onClick={() => setActiveTab("hero")}
        >
          🖼️ Hero Görselleri
        </Tab>
        <Tab
          $isActive={activeTab === "about"}
          onClick={() => setActiveTab("about")}
        >
          ℹ️ Hakkımızda
        </Tab>
        <Tab
          $isActive={activeTab === "regions"}
          onClick={() => setActiveTab("regions")}
        >
          📍 Bölgeler
        </Tab>
        <Tab
          $isActive={activeTab === "contact"}
          onClick={() => setActiveTab("contact")}
        >
          📞 İletişim
        </Tab>
        <Tab
          $isActive={activeTab === "faq"}
          onClick={() => setActiveTab("faq")}
        >
          ❓ SSS
        </Tab>
      </TabContainer>

      <ContentArea>
        {/* Hero Slides Tab */}
        {activeTab === "hero" && (
          <Section>
            <SectionHeader>
              <SectionTitle>Hero Görselleri</SectionTitle>
              <AddButton onClick={addHeroSlide}>+ Yeni Görsel Ekle</AddButton>
            </SectionHeader>

            {heroSlides.map((slide, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Görsel {index + 1}</CardTitle>
                  <RemoveButton onClick={() => removeHeroSlide(index)}>
                    🗑️
                  </RemoveButton>
                </CardHeader>
                <FormGrid>
                  <FormGroup $fullWidth>
                    <Label>Görsel URL</Label>
                    <Input
                      value={slide.imageUrl}
                      onChange={(e) =>
                        updateHeroSlide(index, "imageUrl", e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={slide.isActive}
                        onChange={(e) =>
                          updateHeroSlide(index, "isActive", e.target.checked)
                        }
                      />
                      Aktif
                    </CheckboxLabel>
                  </FormGroup>
                </FormGrid>
                {slide.imageUrl && (
                  <ImagePreview>
                    <img src={slide.imageUrl} alt={`Slide ${index + 1}`} />
                  </ImagePreview>
                )}
              </Card>
            ))}

            <SaveButton
              onClick={saveHeroSlides}
              disabled={updateHeroSlides.isPending}
            >
              {updateHeroSlides.isPending ? "Kaydediliyor..." : "💾 Kaydet"}
            </SaveButton>
          </Section>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <Section>
            <SectionTitle>Hakkımızda Bilgisi</SectionTitle>

            <Card>
              <FormGroup>
                <Label>Başlık</Label>
                <Input
                  value={aboutInfo.aboutTitle}
                  onChange={(e) =>
                    setAboutInfo({ ...aboutInfo, aboutTitle: e.target.value })
                  }
                  placeholder="Buca'nın Zamansız Tekeli"
                />
              </FormGroup>

              <FormGroup>
                <Label>Açıklama (paragrafları boş satır ile ayırın)</Label>
                <TextArea
                  value={aboutInfo.aboutDescription}
                  onChange={(e) =>
                    setAboutInfo({
                      ...aboutInfo,
                      aboutDescription: e.target.value,
                    })
                  }
                  rows={8}
                  placeholder="Hakkımızda bilgisi..."
                />
              </FormGroup>
            </Card>

            <SectionHeader>
              <SectionSubtitle>Özellikler</SectionSubtitle>
              <AddButton onClick={addFeature}>+ Özellik Ekle</AddButton>
            </SectionHeader>

            {aboutInfo.features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Özellik {index + 1}</CardTitle>
                  <RemoveButton onClick={() => removeFeature(index)}>
                    🗑️
                  </RemoveButton>
                </CardHeader>
                <FormGrid>
                  <FormGroup>
                    <Label>İkon (emoji)</Label>
                    <Input
                      value={feature.icon}
                      onChange={(e) =>
                        updateFeature(index, "icon", e.target.value)
                      }
                      placeholder="🕐"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Başlık</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) =>
                        updateFeature(index, "title", e.target.value)
                      }
                      placeholder="7/24 Hizmet"
                    />
                  </FormGroup>
                  <FormGroup $fullWidth>
                    <Label>Açıklama</Label>
                    <Input
                      value={feature.description}
                      onChange={(e) =>
                        updateFeature(index, "description", e.target.value)
                      }
                      placeholder="Gece gündüz hizmetinizdeyiz"
                    />
                  </FormGroup>
                </FormGrid>
              </Card>
            ))}

            <SaveButton
              onClick={saveAboutInfo}
              disabled={updateAboutInfo.isPending}
            >
              {updateAboutInfo.isPending ? "Kaydediliyor..." : "💾 Kaydet"}
            </SaveButton>
          </Section>
        )}

        {/* Regions Tab */}
        {activeTab === "regions" && (
          <Section>
            <SectionHeader>
              <SectionTitle>Hizmet Bölgeleri</SectionTitle>
              <AddButton onClick={addRegion}>+ Bölge Ekle</AddButton>
            </SectionHeader>

            <RegionsList>
              {regions.map((region, index) => (
                <RegionItem key={index}>
                  <Input
                    value={region.name}
                    onChange={(e) =>
                      updateRegion(index, "name", e.target.value)
                    }
                    placeholder="Bölge adı"
                  />
                  <SmallInput
                    type="number"
                    value={region.sortOrder}
                    onChange={(e) =>
                      updateRegion(
                        index,
                        "sortOrder",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Sıra"
                  />
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={region.isActive}
                      onChange={(e) =>
                        updateRegion(index, "isActive", e.target.checked)
                      }
                    />
                    Aktif
                  </CheckboxLabel>
                  <RemoveButton onClick={() => removeRegion(index)}>
                    🗑️
                  </RemoveButton>
                </RegionItem>
              ))}
            </RegionsList>

            <SaveButton
              onClick={saveRegions}
              disabled={updateRegions.isPending}
            >
              {updateRegions.isPending ? "Kaydediliyor..." : "💾 Kaydet"}
            </SaveButton>
          </Section>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <Section>
            <SectionTitle>İletişim Bilgileri</SectionTitle>

            <Card>
              <FormGrid>
                <FormGroup>
                  <Label>Telefon</Label>
                  <Input
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    placeholder="+90 546 954 98 97"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>WhatsApp</Label>
                  <Input
                    value={contactInfo.whatsapp}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        whatsapp: e.target.value,
                      })
                    }
                    placeholder="+90 546 954 98 97"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>E-posta</Label>
                  <Input
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    placeholder="info@adotekel.com"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Adres</Label>
                  <Input
                    value={contactInfo.address}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="Buca, Menderes Caddesi No:128/A"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Şehir</Label>
                  <Input
                    value={contactInfo.city}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, city: e.target.value })
                    }
                    placeholder="35390 İzmir"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Ülke</Label>
                  <Input
                    value={contactInfo.country}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        country: e.target.value,
                      })
                    }
                    placeholder="Türkiye"
                  />
                </FormGroup>
                <FormGroup $fullWidth>
                  <Label>Instagram URL (opsiyonel)</Label>
                  <Input
                    value={contactInfo.instagramUrl || ""}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        instagramUrl: e.target.value,
                      })
                    }
                    placeholder="https://instagram.com/..."
                  />
                </FormGroup>
              </FormGrid>
            </Card>

            <SaveButton
              onClick={saveContactInfo}
              disabled={updateContactInfo.isPending}
            >
              {updateContactInfo.isPending ? "Kaydediliyor..." : "💾 Kaydet"}
            </SaveButton>
          </Section>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <Section>
            <SectionHeader>
              <SectionTitle>Sık Sorulan Sorular</SectionTitle>
              <AddButton onClick={addFaq}>+ Soru Ekle</AddButton>
            </SectionHeader>

            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Soru {index + 1}</CardTitle>
                  <RemoveButton onClick={() => removeFaq(index)}>
                    🗑️
                  </RemoveButton>
                </CardHeader>
                <FormGrid>
                  <FormGroup $fullWidth>
                    <Label>Soru</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) =>
                        updateFaq(index, "question", e.target.value)
                      }
                      placeholder="Sipariş nasıl verebilirim?"
                    />
                  </FormGroup>
                  <FormGroup $fullWidth>
                    <Label>Cevap</Label>
                    <TextArea
                      value={faq.answer}
                      onChange={(e) =>
                        updateFaq(index, "answer", e.target.value)
                      }
                      rows={4}
                      placeholder="Cevabınızı buraya yazın..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Sıra No</Label>
                    <SmallInput
                      type="number"
                      value={faq.sortOrder}
                      onChange={(e) =>
                        updateFaq(
                          index,
                          "sortOrder",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Sıra"
                    />
                  </FormGroup>
                  <FormGroup>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={faq.isActive}
                        onChange={(e) =>
                          updateFaq(index, "isActive", e.target.checked)
                        }
                      />
                      Aktif
                    </CheckboxLabel>
                  </FormGroup>
                </FormGrid>
              </Card>
            ))}

            {faqs.length === 0 && (
              <EmptyState>
                Henüz soru eklenmedi. "Soru Ekle" butonuna tıklayarak yeni soru
                ekleyebilirsiniz.
              </EmptyState>
            )}

            <SaveButton onClick={saveFaqs} disabled={updateFaqs.isPending}>
              {updateFaqs.isPending ? "Kaydediliyor..." : "💾 Kaydet"}
            </SaveButton>
          </Section>
        )}
      </ContentArea>
    </Wrapper>
  );
};

export default DashboardSiteSettings;

// Styled Components
const Wrapper = styled.div``;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes.xxl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.sizes.md};
  margin: 0;
`;

const LoadingText = styled.p`
  color: ${theme.colors.textSecondary};
  text-align: center;
  padding: ${theme.spacing.xl};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${(props) =>
    props.$isActive ? theme.colors.primary : theme.colors.bgCard};
  color: ${(props) => (props.$isActive ? "#000" : theme.colors.textSecondary)};
  border: 1px solid
    ${(props) => (props.$isActive ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? theme.colors.primary : theme.colors.primaryLight};
    color: ${(props) => (props.$isActive ? "#000" : theme.colors.primary)};
  }
`;

const ContentArea = styled.div``;

const Section = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.lg} 0;
`;

const SectionSubtitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const Card = styled.div`
  background-color: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const CardTitle = styled.h4`
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.primary};
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  grid-column: ${(props) => (props.$fullWidth ? "1 / -1" : "auto")};
`;

const Label = styled.label`
  display: block;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.bgDark};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.sizes.md};
  transition: border-color ${theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const SmallInput = styled(Input)`
  width: 80px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.bgDark};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.sizes.md};
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color ${theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.sizes.md};
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ImagePreview = styled.div`
  margin-top: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  max-width: 300px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const AddButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primaryLight};
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    background-color: ${theme.colors.primary};
    color: #000;
  }
`;

const RemoveButton = styled.button`
  padding: ${theme.spacing.sm};
  background: none;
  border: none;
  font-size: ${theme.typography.sizes.lg};
  cursor: pointer;
  opacity: 0.7;
  transition: opacity ${theme.transitions.normal};

  &:hover {
    opacity: 1;
  }
`;

const SaveButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background-color: ${theme.colors.primary};
  color: #000;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  margin-top: ${theme.spacing.lg};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primaryHover};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RegionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const RegionItem = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-wrap: wrap;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  background-color: ${theme.colors.bgCard};
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.sizes.md};
`;
