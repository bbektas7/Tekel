import React, { useState } from "react";
import styled from "styled-components";
import {
  useStockMovementsQuery,
  useAdminProductsQuery,
  useAdjustStockMutation,
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
  PaginationWrapper,
  PaginationButton,
} from "../../styles";
import { theme } from "../../styles/theme";
import type {
  StockAdjustmentPayload,
  Product,
  StockMovement,
} from "../../types";

const DashboardStock: React.FC = () => {
  const [page, setPage] = useState(1);
  const [productFilter, setProductFilter] = useState("");
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const { success, error: showError } = useToast();

  const { data: movementsData, isLoading } = useStockMovementsQuery({
    page,
    pageSize: 15,
    productId: productFilter || undefined,
  });

  const { data: productsData } = useAdminProductsQuery({ pageSize: 100 });

  const adjustMutation = useAdjustStockMutation();

  // Adjust form state
  const [adjustForm, setAdjustForm] = useState({
    productId: "",
    quantityDelta: 0,
    reason: "",
    note: "",
  });

  const resetAdjustForm = () => {
    setAdjustForm({
      productId: "",
      quantityDelta: 0,
      reason: "",
      note: "",
    });
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: StockAdjustmentPayload = {
        quantityDelta: adjustForm.quantityDelta,
        reason: adjustForm.reason,
        note: adjustForm.note || undefined,
      };

      await adjustMutation.mutateAsync({
        productId: adjustForm.productId,
        payload,
      });

      success("Stok başarıyla güncellendi");
      setIsAdjustModalOpen(false);
      resetAdjustForm();
    } catch (err: any) {
      showError(err.response?.data?.message || "Stok güncellemesi başarısız");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getQuantityStyle = (delta: number) => {
    if (delta > 0) return "success";
    if (delta < 0) return "error";
    return "default";
  };

  const reasonOptions = [
    { value: "purchase", label: "Satın Alma" },
    { value: "sale", label: "Satış" },
    { value: "return", label: "İade" },
    { value: "adjustment", label: "Sayım Düzeltmesi" },
    { value: "damage", label: "Hasar/Fire" },
    { value: "other", label: "Diğer" },
  ];

  return (
    <div>
      <Header>
        <PageTitle>Stok Hareketleri</PageTitle>
        <PrimaryButton onClick={() => setIsAdjustModalOpen(true)}>
          📊 Stok Ayarla
        </PrimaryButton>
      </Header>

      {/* Filters */}
      <FiltersRow>
        <FilterSelect
          value={productFilter}
          onChange={(e) => {
            setProductFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tüm Ürünler</option>
          {productsData?.items.map((product: Product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </FilterSelect>
      </FiltersRow>

      {/* Stock Movements Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : movementsData?.items.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📈</EmptyStateIcon>
          <EmptyStateTitle>Stok Hareketi Bulunamadı</EmptyStateTitle>
          <EmptyStateText>Henüz stok hareketi kaydedilmemiş.</EmptyStateText>
        </EmptyState>
      ) : (
        <>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Miktar</TableHead>
                  <TableHead>Sebep</TableHead>
                  <TableHead>Not</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {movementsData?.items.map((movement: StockMovement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <DateText>{formatDate(movement.createdAt)}</DateText>
                    </TableCell>
                    <TableCell>
                      <ProductName>
                        {movement.product?.name ||
                          `Ürün #${movement.productId}`}
                      </ProductName>
                    </TableCell>
                    <TableCell>
                      <Badge
                        $variant={
                          getQuantityStyle(movement.quantityDelta) as
                            | "success"
                            | "error"
                            | "default"
                        }
                      >
                        {movement.quantityDelta > 0 ? "+" : ""}
                        {movement.quantityDelta}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ReasonText>
                        {reasonOptions.find((r) => r.value === movement.reason)
                          ?.label || movement.reason}
                      </ReasonText>
                    </TableCell>
                    <TableCell>
                      <NoteText>{movement.note || "-"}</NoteText>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          {/* Pagination */}
          {movementsData && movementsData.totalPages > 1 && (
            <PaginationWrapper>
              <PaginationButton
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </PaginationButton>
              <PaginationInfo>
                {page} / {movementsData.totalPages}
              </PaginationInfo>
              <PaginationButton
                disabled={page >= movementsData.totalPages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </PaginationButton>
            </PaginationWrapper>
          )}
        </>
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => {
          setIsAdjustModalOpen(false);
          resetAdjustForm();
        }}
        title="Stok Ayarla"
        width="500px"
      >
        <Form onSubmit={handleAdjustSubmit}>
          <FormGroup>
            <FormLabel>Ürün *</FormLabel>
            <FormSelect
              value={adjustForm.productId}
              onChange={(e) =>
                setAdjustForm({ ...adjustForm, productId: e.target.value })
              }
              required
            >
              <option value="">Ürün seçin</option>
              {productsData?.items.map((product: Product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Mevcut: {product.stockQuantity})
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Miktar Değişimi *</FormLabel>
            <FormInput
              type="number"
              value={adjustForm.quantityDelta}
              onChange={(e) =>
                setAdjustForm({
                  ...adjustForm,
                  quantityDelta: parseInt(e.target.value) || 0,
                })
              }
              required
              placeholder="Pozitif: ekleme, Negatif: çıkarma"
            />
            <HelpText>
              Pozitif sayı stok ekler, negatif sayı stok düşer.
            </HelpText>
          </FormGroup>

          <FormGroup>
            <FormLabel>Sebep *</FormLabel>
            <FormSelect
              value={adjustForm.reason}
              onChange={(e) =>
                setAdjustForm({ ...adjustForm, reason: e.target.value })
              }
              required
            >
              <option value="">Sebep seçin</option>
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Not</FormLabel>
            <FormTextarea
              value={adjustForm.note}
              onChange={(e) =>
                setAdjustForm({ ...adjustForm, note: e.target.value })
              }
              rows={2}
              placeholder="Ek açıklama (opsiyonel)..."
            />
          </FormGroup>

          <ModalActions>
            <SecondaryButton
              type="button"
              onClick={() => {
                setIsAdjustModalOpen(false);
                resetAdjustForm();
              }}
            >
              İptal
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={adjustMutation.isPending}>
              {adjustMutation.isPending ? "Kaydediliyor..." : "Stok Güncelle"}
            </PrimaryButton>
          </ModalActions>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardStock;

// Table Skeleton
const TableSkeleton: React.FC = () => (
  <TableWrapper>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tarih</TableHead>
          <TableHead>Ürün</TableHead>
          <TableHead>Miktar</TableHead>
          <TableHead>Sebep</TableHead>
          <TableHead>Not</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton $height="20px" $width="120px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="150px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="50px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="80px" />
            </TableCell>
            <TableCell>
              <Skeleton $height="20px" $width="100px" />
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
`;

const FilterSelect = styled(FormSelect)`
  width: 300px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
`;

const DateText = styled.div`
  color: ${theme.colors.textMuted};
  font-size: ${theme.typography.sizes.sm};
`;

const ProductName = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.textPrimary};
`;

const ReasonText = styled.div`
  color: ${theme.colors.textSecondary};
`;

const NoteText = styled.div`
  color: ${theme.colors.textMuted};
  font-size: ${theme.typography.sizes.sm};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const HelpText = styled.p`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.textMuted};
  margin: ${theme.spacing.xs} 0 0 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;
