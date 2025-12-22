import React, { useState } from "react";
import styled from "styled-components";
import {
  useAdminProductsQuery,
  useCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../hooks";
import { Modal, useToast } from "../../components";
import {
  PageTitle,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
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
  StockBadge,
  Skeleton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  PaginationWrapper,
  PaginationButton,
} from "../../styles";
import { theme } from "../../styles/theme";
import type { Product, Category, CreateProductPayload } from "../../types";

const DashboardProducts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const { success, error: showError } = useToast();

  const { data: productsData, isLoading } = useAdminProductsQuery({
    page,
    pageSize: 10,
    q: searchTerm || undefined,
    categoryId: categoryFilter || undefined,
  });

  const { data: categories } = useCategoriesQuery();

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  // Form state
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    brand: "",
    volume: "",
    imageUrl: "",
    stockQuantity: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      brand: "",
      volume: "",
      imageUrl: "",
      stockQuantity: 0,
      isActive: true,
    });
    setEditingProduct(null);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        categoryId: product.categoryId || product.category?.id || "",
        brand: product.brand || "",
        volume: product.volume || "",
        imageUrl: product.imageUrl || "",
        stockQuantity: product.stockQuantity,
        isActive: product.isActive,
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
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          payload: formData,
        });
        success("Ürün başarıyla güncellendi");
      } else {
        await createMutation.mutateAsync(formData);
        success("Ürün başarıyla eklendi");
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
      success("Ürün başarıyla silindi");
      setDeleteConfirm(null);
    } catch (err: any) {
      showError(err.response?.data?.message || "Silme işlemi başarısız");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  return (
    <div>
      <Header>
        <PageTitle>Ürün Yönetimi</PageTitle>
        <PrimaryButton onClick={() => handleOpenModal()}>
          ➕ Yeni Ürün Ekle
        </PrimaryButton>
      </Header>

      {/* Filters */}
      <FiltersRow>
        <SearchInput
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <FilterSelect
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tüm Kategoriler</option>
          {categories?.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </FilterSelect>
      </FiltersRow>

      {/* Products Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : productsData?.items.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📦</EmptyStateIcon>
          <EmptyStateTitle>Ürün Bulunamadı</EmptyStateTitle>
          <EmptyStateText>
            Henüz ürün eklenmemiş veya arama sonucu bulunamadı.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {productsData?.items.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <ProductInfo>
                        <ProductName>{product.name}</ProductName>
                        {product.brand && (
                          <ProductMeta>{product.brand}</ProductMeta>
                        )}
                      </ProductInfo>
                    </TableCell>
                    <TableCell>
                      <Badge>{product.category?.name || "-"}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <StockBadge $quantity={product.stockQuantity}>
                        {product.stockQuantity}
                      </StockBadge>
                    </TableCell>
                    <TableCell>
                      <Badge $variant={product.isActive ? "success" : "error"}>
                        {product.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <IconButton
                          onClick={() => handleOpenModal(product)}
                          title="Düzenle"
                        >
                          ✏️
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteConfirm(product)}
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

          {/* Pagination */}
          {productsData && productsData.totalPages > 1 && (
            <PaginationWrapper>
              <PaginationButton
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </PaginationButton>
              <PaginationInfo>
                {page} / {productsData.totalPages}
              </PaginationInfo>
              <PaginationButton
                disabled={page >= productsData.totalPages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </PaginationButton>
            </PaginationWrapper>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
        width="600px"
      >
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <FormLabel>Ürün Adı *</FormLabel>
              <FormInput
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Ürün adını girin"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Kategori *</FormLabel>
              <FormSelect
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
              >
                <option value="">Kategori seçin</option>
                {categories?.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>Fiyat (₺) *</FormLabel>
              <FormInput
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
                min="0"
                step="0.01"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Stok Miktarı *</FormLabel>
              <FormInput
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockQuantity: parseInt(e.target.value) || 0,
                  })
                }
                required
                min="0"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel>Marka</FormLabel>
              <FormInput
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="Örn: Efes, Jack Daniels"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Hacim</FormLabel>
              <FormInput
                type="text"
                value={formData.volume}
                onChange={(e) =>
                  setFormData({ ...formData, volume: e.target.value })
                }
                placeholder="Örn: 500ml, 70cl"
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <FormLabel>Görsel URL</FormLabel>
            <FormInput
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://..."
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
              placeholder="Ürün açıklaması..."
            />
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
                : editingProduct
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
        title="Ürün Sil"
      >
        <DeleteConfirmContent>
          <p>
            <strong>{deleteConfirm?.name}</strong> ürününü silmek istediğinize
            emin misiniz?
          </p>
          <p>Bu işlem geri alınamaz.</p>
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

export default DashboardProducts;

// Table Skeleton Component
const TableSkeleton: React.FC = () => (
  <TableWrapper>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ürün</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Fiyat</TableHead>
          <TableHead>Stok</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton $height="20px" $width="150px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="80px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="60px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="40px" />
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

const FiltersRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SearchInput = styled(FormInput)`
  flex: 1;
  max-width: 300px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 100%;
  }
`;

const FilterSelect = styled(FormSelect)`
  width: 200px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const ProductInfo = styled.div``;

const ProductName = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.textPrimary};
`;

const ProductMeta = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.textMuted};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const PaginationInfo = styled.span`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.textSecondary};
  padding: 0 ${theme.spacing.md};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const DeleteConfirmContent = styled.div`
  text-align: center;

  p {
    color: ${theme.colors.textSecondary};
    margin: 0 0 ${theme.spacing.md} 0;
  }
`;
