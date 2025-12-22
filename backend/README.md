# TekelBayim Backend API

Tekel Bayisi için geliştirilmiş modern bir backend API. .NET 8, Clean Architecture ve CQRS pattern ile geliştirilmiştir.

## 🚀 Teknolojiler

- **.NET 8** - ASP.NET Core Web API
- **Clean Architecture** - Katmanlı mimari
- **CQRS Pattern** - MediatR ile komut/sorgu ayrımı
- **PostgreSQL** - Npgsql Entity Framework Core
- **ASP.NET Core Identity** - Cookie tabanlı kimlik doğrulama
- **FluentValidation** - İstek doğrulama
- **Mapster** - Object mapping
- **Serilog** - Yapılandırılmış logging
- **Swagger/OpenAPI** - API dokümantasyonu

## 📁 Proje Yapısı

```
TekelBayiBackend/
├── src/
│   ├── TekelBayim.Api/           # Presentation katmanı (Controllers, Middleware)
│   ├── TekelBayim.Application/   # Business logic (CQRS, DTOs, Validators)
│   ├── TekelBayim.Domain/        # Domain entities, enums
│   ├── TekelBayim.Infrastructure/# Data access, Identity, EF Core
│   └── TekelBayim.Shared/        # Ortak modeller (Result, PagedResult, Exceptions)
└── TekelBayim.sln
```

## ⚙️ Kurulum

### Gereksinimler

- .NET 8 SDK
- PostgreSQL 14+
- Visual Studio 2022 veya VS Code

### 1. PostgreSQL Veritabanı Oluştur

```sql
CREATE DATABASE TekelBayimDb;
```

### 2. Connection String Ayarla

`src/TekelBayim.Api/appsettings.Development.json` dosyasını düzenleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=TekelBayimDb;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

### 3. Migration Oluştur ve Uygula

```bash
# Proje dizinine git
cd TekelBayiBackend

# EF Core Tools yüklü değilse
dotnet tool install --global dotnet-ef

# Migration oluştur
dotnet ef migrations add InitialCreate --project src/TekelBayim.Infrastructure --startup-project src/TekelBayim.Api

# Migration uygula (opsiyonel - uygulama başlarken otomatik uygulanır)
dotnet ef database update --project src/TekelBayim.Infrastructure --startup-project src/TekelBayim.Api
```

### 4. Uygulamayı Çalıştır

```bash
dotnet run --project src/TekelBayim.Api
```

Swagger UI: https://localhost:5001 veya http://localhost:5000

## 🔐 Varsayılan Admin Kullanıcı

Uygulama ilk çalıştırıldığında otomatik olarak seed edilir:

- **Email:** `admin@tekelbayim.local`
- **Password:** `Admin123!`
- **Role:** Admin

## 📋 API Endpoints

### Public Endpoints

| Method | Endpoint             | Açıklama                                   |
| ------ | -------------------- | ------------------------------------------ |
| GET    | `/api/categories`    | Tüm aktif kategorileri listele             |
| GET    | `/api/products`      | Ürünleri listele (filtre, sırala, sayfala) |
| GET    | `/api/products/{id}` | Ürün detayı                                |

#### Ürün Listeleme Query Parametreleri

- `categoryId` - Kategori filtresi (Guid)
- `q` - Arama sorgusu (isim, marka, açıklama)
- `minPrice` - Minimum fiyat
- `maxPrice` - Maksimum fiyat
- `inStock` - Stokta var mı (true/false)
- `sort` - Sıralama: `priceAsc`, `priceDesc`, `nameAsc`, `newest` (default)
- `page` - Sayfa numarası (default: 1)
- `pageSize` - Sayfa boyutu (default: 20, max: 100)

### Auth Endpoints

| Method | Endpoint             | Açıklama                 |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/login`    | Giriş yap                |
| POST   | `/api/auth/register` | Kayıt ol (opsiyonel)     |
| POST   | `/api/auth/logout`   | Çıkış yap                |
| GET    | `/api/auth/me`       | Mevcut kullanıcı bilgisi |

### Admin Endpoints (Rol: Admin veya Manager)

| Method | Endpoint                         | Açıklama          |
| ------ | -------------------------------- | ----------------- |
| POST   | `/api/admin/categories`          | Kategori oluştur  |
| PUT    | `/api/admin/categories/{id}`     | Kategori güncelle |
| DELETE | `/api/admin/categories/{id}`     | Kategori sil      |
| POST   | `/api/admin/products`            | Ürün oluştur      |
| PUT    | `/api/admin/products/{id}`       | Ürün güncelle     |
| DELETE | `/api/admin/products/{id}`       | Ürün sil          |
| PATCH  | `/api/admin/products/{id}/stock` | Stok ayarla       |
| GET    | `/api/admin/stock-movements`     | Stok hareketleri  |
| GET    | `/api/admin/summary`             | Dashboard özeti   |

### Stok Ayarlama Request Body

```json
{
  "quantityDelta": 10,
  "reason": "Restock",
  "note": "Haftalık stok girişi"
}
```

**Reason değerleri:** `ManualAdjustment`, `Restock`, `Sale`, `Damage`, `Other`

## 🔒 Güvenlik

- **Cookie Authentication:** HttpOnly, SameSite=Lax
- **Role-Based Authorization:** Admin, Manager, Customer
- **CSRF Koruması:** SameSite cookie politikası
- **Şifre Politikası:** Min 8 karakter, büyük/küçük harf, rakam, özel karakter

## 📊 Veri Modelleri

### Category

- Id, Name, Slug, ParentCategoryId, SortOrder, IsActive, CreatedAt, UpdatedAt

### Product

- Id, CategoryId, Name, Brand, Volume, Price, StockQuantity, Description, ImageUrl, IsActive, CreatedAt, UpdatedAt

### StockMovement

- Id, ProductId, QuantityDelta, Reason, Note, CreatedByUserId, CreatedAt

## 🧪 Test Senaryoları

### 1. Login

```bash
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tekelbayim.local","password":"Admin123!"}' \
  -c cookies.txt
```

### 2. Kategorileri Listele

```bash
curl https://localhost:5001/api/categories
```

### 3. Ürün Oluştur (Admin)

```bash
curl -X POST https://localhost:5001/api/admin/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "categoryId": "KATEGORI_ID",
    "name": "Test Ürün",
    "brand": "Test Marka",
    "volume": "500ml",
    "price": 99.99,
    "stockQuantity": 50
  }'
```

## 📝 Loglama

Loglar iki yere yazılır:

- **Console:** Renkli, özet format
- **File:** `logs/tekelbayim-{tarih}.log` - 7 günlük rotasyon

## 🔧 Geliştirme Notları

### Yeni Migration Oluşturma

```bash
dotnet ef migrations add MigrationName --project src/TekelBayim.Infrastructure --startup-project src/TekelBayim.Api
```

### CORS Ayarları

Development ortamında `http://localhost:3000` ve `http://localhost:5173` adreslerine izin verilmiştir.

## 📄 Lisans

MIT
