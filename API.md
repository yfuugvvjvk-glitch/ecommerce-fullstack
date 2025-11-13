# 📚 API Documentation

## Base URL

```
Development: http://localhost:3001
Production: https://your-api-domain.com
```

## Authentication

Toate endpoint-urile protejate necesită header-ul:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### POST /api/auth/register

Înregistrare utilizator nou.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**

- `409`: User already exists
- `400`: Validation error

---

### POST /api/auth/login

Autentificare utilizator.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Errors:**

- `401`: Invalid credentials
- `400`: Validation error

---

### GET /api/auth/me

Obține utilizatorul curent (Protected).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

## 🛍️ Products (DataItems) Endpoints

### GET /api/data

Obține lista de produse.

**Query Parameters:**

- `page` (optional): Număr pagină (default: 1)
- `limit` (optional): Produse per pagină (default: 20)
- `category` (optional): Filtrare după categorie
- `search` (optional): Căutare în titlu/descriere
- `status` (optional): Filtrare după status

**Response (200):**

```json
{
  "data": [
    {
      "id": "clx123...",
      "title": "Laptop",
      "description": "Laptop performant",
      "price": 2999.99,
      "oldPrice": 3499.99,
      "stock": 10,
      "image": "/images/laptop.jpg",
      "category": "electronice",
      "status": "published",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 20
}
```

---

### GET /api/data/:id

Obține detalii produs.

**Response (200):**

```json
{
  "id": "clx123...",
  "title": "Laptop",
  "description": "Laptop performant",
  "content": "Descriere detaliată...",
  "price": 2999.99,
  "oldPrice": 3499.99,
  "stock": 10,
  "image": "/images/laptop.jpg",
  "category": "electronice",
  "status": "published"
}
```

---

### POST /api/data

Creează produs nou (Protected - Admin only).

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "title": "Produs Nou",
  "description": "Descriere scurtă",
  "content": "Conținut detaliat",
  "price": 99.99,
  "oldPrice": 149.99,
  "stock": 50,
  "image": "/images/produs.jpg",
  "category": "electronice",
  "status": "published"
}
```

**Response (201):**

```json
{
  "id": "clx456...",
  "title": "Produs Nou",
  ...
}
```

---

### PUT /api/data/:id

Actualizează produs (Protected - Admin only).

**Request Body:** (toate câmpurile sunt opționale)

```json
{
  "title": "Titlu Actualizat",
  "price": 89.99,
  "stock": 45
}
```

---

### DELETE /api/data/:id

Șterge produs (Protected - Admin only).

**Response (200):**

```json
{
  "message": "Product deleted successfully"
}
```

---

## 🛒 Shopping Cart Endpoints

### GET /api/cart

Obține coșul utilizatorului (Protected).

**Response (200):**

```json
{
  "items": [
    {
      "id": "clx789...",
      "quantity": 2,
      "dataItem": {
        "id": "clx123...",
        "title": "Laptop",
        "price": 2999.99,
        "image": "/images/laptop.jpg",
        "stock": 10
      }
    }
  ],
  "total": 5999.98,
  "itemCount": 2
}
```

---

### POST /api/cart

Adaugă produs în coș (Protected).

**Request Body:**

```json
{
  "dataItemId": "clx123...",
  "quantity": 2
}
```

**Response (200):**

```json
{
  "id": "clx789...",
  "quantity": 2,
  "dataItem": { ... }
}
```

**Errors:**

- `400`: Insufficient stock
- `404`: Product not found

---

### PUT /api/cart/:id

Actualizează cantitate (Protected).

**Request Body:**

```json
{
  "quantity": 3
}
```

---

### DELETE /api/cart/:id

Șterge produs din coș (Protected).

**Response (200):**

```json
{
  "message": "Item removed from cart"
}
```

---

### DELETE /api/cart

Golește coșul (Protected).

**Response (200):**

```json
{
  "message": "Cart cleared"
}
```

---

## 📦 Orders Endpoints

### POST /api/orders

Plasează comandă nouă (Protected).

**Request Body:**

```json
{
  "items": [
    {
      "dataItemId": "clx123...",
      "quantity": 2,
      "price": 2999.99
    }
  ],
  "total": 5999.98,
  "shippingAddress": "Str. Exemplu nr. 1, București",
  "voucherCode": "DISCOUNT10"
}
```

**Response (201):**

```json
{
  "id": "clx999...",
  "userId": "clx111...",
  "total": 5399.98,
  "status": "pending",
  "shippingAddress": "Str. Exemplu nr. 1, București",
  "orderItems": [ ... ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### GET /api/orders/my

Obține comenzile utilizatorului (Protected).

**Response (200):**

```json
[
  {
    "id": "clx999...",
    "total": 5999.98,
    "status": "pending",
    "shippingAddress": "...",
    "orderItems": [ ... ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### GET /api/orders/:id

Obține detalii comandă (Protected).

**Response (200):**

```json
{
  "id": "clx999...",
  "total": 5999.98,
  "status": "pending",
  "shippingAddress": "...",
  "orderItems": [
    {
      "id": "clx888...",
      "quantity": 2,
      "price": 2999.99,
      "dataItem": { ... }
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎟️ Vouchers Endpoints

### POST /api/vouchers/validate

Validează voucher (Protected).

**Request Body:**

```json
{
  "code": "DISCOUNT10",
  "cartTotal": 5999.98
}
```

**Response (200):**

```json
{
  "voucher": {
    "id": "clx777...",
    "code": "DISCOUNT10",
    "discountType": "percentage",
    "discountValue": 10
  },
  "discount": 599.99,
  "finalTotal": 5399.99
}
```

**Errors:**

- `400`: Invalid voucher / Expired / Usage limit reached

---

### GET /api/vouchers/active

Obține vouchere active.

**Response (200):**

```json
[
  {
    "id": "clx777...",
    "code": "DISCOUNT10",
    "description": "10% discount",
    "discountType": "percentage",
    "discountValue": 10,
    "minPurchase": 100,
    "validUntil": "2024-12-31T23:59:59.000Z"
  }
]
```

---

## 👤 User Profile Endpoints

### GET /api/user/profile

Obține profilul utilizatorului (Protected).

**Response (200):**

```json
{
  "id": "clx111...",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+40745123456",
  "address": "Str. Exemplu nr. 1",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT /api/user/profile

Actualizează profil (Protected).

**Request Body:**

```json
{
  "name": "John Updated",
  "phone": "+40745999999",
  "address": "Str. Nouă nr. 2"
}
```

---

### POST /api/user/change-password

Schimbă parola (Protected).

**Request Body:**

```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response (200):**

```json
{
  "message": "Password changed successfully"
}
```

---

### GET /api/user/favorites

Obține produse favorite (Protected).

---

### POST /api/user/favorites

Adaugă la favorite (Protected).

**Request Body:**

```json
{
  "dataItemId": "clx123..."
}
```

---

### DELETE /api/user/favorites/:dataItemId

Șterge din favorite (Protected).

---

## 👨‍💼 Admin Endpoints

Toate endpoint-urile admin necesită rol de administrator.

### GET /api/admin/stats

Statistici dashboard.

**Response (200):**

```json
{
  "totalUsers": 25,
  "totalProducts": 12,
  "totalOrders": 48,
  "totalRevenue": 12450.50,
  "pendingOrders": 5,
  "recentOrders": [ ... ]
}
```

---

### GET /api/admin/users

Lista utilizatori.

**Query Parameters:**

- `page`: Număr pagină
- `limit`: Utilizatori per pagină

---

### PUT /api/admin/users/:id/role

Schimbă rol utilizator.

**Request Body:**

```json
{
  "role": "admin"
}
```

---

### DELETE /api/admin/users/:id

Șterge utilizator.

---

### GET /api/admin/orders

Toate comenzile.

**Query Parameters:**

- `page`: Număr pagină
- `limit`: Comenzi per pagină
- `status`: Filtrare după status

---

### PUT /api/admin/orders/:id/status

Schimbă status comandă.

**Request Body:**

```json
{
  "status": "shipped"
}
```

**Status values:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

---

### POST /api/admin/vouchers

Creează voucher.

**Request Body:**

```json
{
  "code": "SUMMER2024",
  "description": "Summer discount",
  "discountType": "percentage",
  "discountValue": 15,
  "minPurchase": 200,
  "maxDiscount": 500,
  "usageLimit": 100,
  "validUntil": "2024-08-31T23:59:59.000Z"
}
```

---

### GET /api/admin/vouchers

Lista vouchere.

---

### PUT /api/admin/vouchers/:id

Actualizează voucher.

---

### DELETE /api/admin/vouchers/:id

Șterge voucher.

---

## Error Responses

Toate endpoint-urile pot returna următoarele erori:

### 400 Bad Request

```json
{
  "error": "Validation Error",
  "details": "Invalid email format"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden - Admin access required"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 409 Conflict

```json
{
  "error": "Conflict",
  "message": "User already exists"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- Auth endpoints: 5 requests/minute
- Other endpoints: 100 requests/minute

---

## Health Check

### GET /health

Verifică starea serverului.

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
