import React, { useState } from "react";
import styled from "styled-components";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../hooks";
import { Modal, useToast } from "../../components";
import {
  PageTitle,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  IconButton,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Skeleton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
} from "../../styles";
import { theme } from "../../styles/theme";
import type { Category, CreateCategoryPayload } from "../../types";

const DashboardCategories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  const { success, error: showError } = useToast();

  const { data: categories, isLoading } = useCategoriesQuery();

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  // Form state
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    name: "",
    description: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setEditingCategory(null);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive ?? true,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          payload: formData,
        });
        success("Kategori başarıyla güncellendi");
      } else {
        await createMutation.mutateAsync(formData);
        success("Kategori başarıyla eklendi");
      }
      handleCloseModal();
    } catch (err: any) {
      showError(err.response?.data?.message || "İşlem başarısız oldu");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteMutation.mutateAsync(deleteConfirm.id);
      success("Kategori başarıyla silindi");
      setDeleteConfirm(null);
    } catch (err: any) {
      showError(err.response?.data?.message || "Silme işlemi başarısız");
    }
  };

  return (
    <div>
      <Header>
        <PageTitle>Kategori Yönetimi</PageTitle>
        <PrimaryButton onClick={() => handleOpenModal()}>
          ➕ Yeni Kategori Ekle
        </PrimaryButton>
      </Header>

      {/* Categories Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : categories?.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📁</EmptyStateIcon>
          <EmptyStateTitle>Kategori Bulunamadı</EmptyStateTitle>
          <EmptyStateText>Henüz kategori eklenmemiş.</EmptyStateText>
        </EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori Adı</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead>Ürün Sayısı</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {categories?.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <CategoryName>{category.name}</CategoryName>
                  </TableCell>
                  <TableCell>
                    <Description>{category.description || "-"}</Description>
                  </TableCell>
                  <TableCell>
                    <Badge>{category.productCount ?? 0} ürün</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge $variant={category.isActive ? "success" : "error"}>
                      {category.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <IconButton
                        onClick={() => handleOpenModal(category)}
                        title="Düzenle"
                      >
                        ✏️
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteConfirm(category)}
                        title="Sil"
                      >
                        🗑️
                      </IconButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Kategori Adı *</FormLabel>
            <FormInput
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Kategori adını girin"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Açıklama</FormLabel>
            <FormTextarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Kategori açıklaması..."
            />
          </FormGroup>

          <FormGroup>
            <ToggleWrapper>
              <ToggleLabel>Aktif Durum</ToggleLabel>
              <ToggleSwitch
                $isActive={formData.isActive ?? true}
                onClick={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
              >
                <ToggleSlider $isActive={formData.isActive ?? true} />
              </ToggleSwitch>
              <ToggleStatus $isActive={formData.isActive ?? true}>
                {formData.isActive ? "Aktif" : "Pasif"}
              </ToggleStatus>
            </ToggleWrapper>
          </FormGroup>

          <ModalActions>
            <SecondaryButton type="button" onClick={handleCloseModal}>
              İptal
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Kaydediliyor..."
                : editingCategory
                ? "Güncelle"
                : "Ekle"}
            </PrimaryButton>
          </ModalActions>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Kategori Sil"
      >
        <DeleteConfirmContent>
          <p>
            <strong>{deleteConfirm?.name}</strong> kategorisini silmek
            istediğinize emin misiniz?
          </p>
          {(deleteConfirm?.productCount ?? 0) > 0 && (
            <WarningText>
              ⚠️ Bu kategoride {deleteConfirm?.productCount} ürün bulunmaktadır.
            </WarningText>
          )}
          <ModalActions>
            <SecondaryButton onClick={() => setDeleteConfirm(null)}>
              İptal
            </SecondaryButton>
            <DangerButton
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Siliniyor..." : "Sil"}
            </DangerButton>
          </ModalActions>
        </DeleteConfirmContent>
      </Modal>
    </div>
  );
};

export default DashboardCategories;

// Table Skeleton
const TableSkeleton: React.FC = () => (
  <TableWrapper>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kategori Adı</TableHead>
          <TableHead>Açıklama</TableHead>
          <TableHead>Ürün Sayısı</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {Array.from({ length: 4 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton $height="20px" $width="120px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="200px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="60px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="50px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="60px" />
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  </TableWrapper>
);

// Styled Components
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const CategoryName = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.textPrimary};
`;

const Description = styled.div`
  color: ${theme.colors.textMuted};
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const ToggleLabel = styled.span`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textSecondary};
`;

const ToggleSwitch = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 50px;
  height: 26px;
  background-color: ${(props) =>
    props.$isActive ? theme.colors.success : theme.colors.border};
  border-radius: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ToggleSlider = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 3px;
  left: ${(props) => (props.$isActive ? "27px" : "3px")};
  width: 20px;
  height: 20px;
  background-color: ${theme.colors.textPrimary};
  border-radius: 50%;
  transition: left 0.3s ease;
`;

const ToggleStatus = styled.span<{ $isActive: boolean }>`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${(props) =>
    props.$isActive ? theme.colors.success : theme.colors.textMuted};
`;

const DeleteConfirmContent = styled.div`
  text-align: center;

  p {
    color: ${theme.colors.textSecondary};
    margin: 0 0 ${theme.spacing.md} 0;
  }
`;

const WarningText = styled.p`
  color: ${theme.colors.warning} !important;
  font-weight: ${theme.typography.weights.medium};
`;
