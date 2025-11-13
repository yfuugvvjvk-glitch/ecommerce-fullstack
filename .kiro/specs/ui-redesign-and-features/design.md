# Design Document

## Overview

This design document outlines the technical architecture and implementation strategy for the comprehensive UI/UX redesign and feature enhancement of the e-commerce platform. The redesign transforms the application into a modern, feature-rich shopping experience with a global navigation system, advanced product management, real-time order tracking, and comprehensive administrative controls.

The implementation leverages the existing Next.js frontend and Fastify backend infrastructure, extending the Prisma database schema to support new features like offers, voucher requests, navigation history, and enhanced user profiles with avatar support.

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Layouts    │  │  Components  │  │    Pages     │     │
│  │              │  │              │  │              │     │
│  │ - MainLayout │  │ - Navbar     │  │ - Home       │     │
│  │ - AuthLayout │  │ - Sidebar    │  │ - Products   │     │
│  │              │  │ - Carousel   │  │ - Product    │     │
│  │              │  │ - Avatar     │  │ - Cart       │     │
│  │              │  │ - Modal      │  │ - Profile    │     │
│  │              │  │ - Filters    │  │ - Admin      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Context & State Management                  │  │
│  │  - AuthContext  - CartContext  - FavoritesContext    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Fastify)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │   Services   │  │ Middleware   │     │
│  │              │  │              │  │              │     │
│  │ - Auth       │  │ - User       │  │ - Auth       │     │
│  │ - Products   │  │ - Product    │  │ - Admin      │     │
│  │ - Cart       │  │ - Cart       │  │ - Upload     │     │
│  │ - Orders     │  │ - Order      │  │              │     │
│  │ - Vouchers   │  │ - Voucher    │  │              │     │
│  │ - Offers     │  │ - Offer      │  │              │     │
│  │ - Favorites  │  │ - Favorite   │  │              │     │
│  │ - Admin      │  │ - Admin      │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Scheduled Jobs (Cron)                    │  │
│  │  - Expire vouchers  - Clean navigation history       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                       │
├─────────────────────────────────────────────────────────────┤
│  Users │ Products │ Orders │ Cart │ Vouchers │ Offers       │
│  Favorites │ Reviews │ NavigationHistory │ VoucherRequests  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Fastify, TypeScript, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens, bcrypt password hashing
- **File Upload**: Multer for avatar and product images
- **Scheduling**: node-cron for automated tasks
- **State Management**: React Context API

## Components and Interfaces

### Frontend Components

#### 1. Global Navbar Component

**Location**: `frontend/components/Navbar.tsx`

**Purpose**: Unified navigation bar displayed across all pages including authentication pages.

**Features**:

- Logo with link to homepage
- Search bar with functional search
- Center navigation links (Contact, About) - visible on all pages including login/register
- User dropdown menu with avatar/initials
- Shopping cart icon with badge

**Props**:

```typescript
interface NavbarProps {
  user?: User | null;
  cartItemCount: number;
}
```

**State**:

- Search query
- Dropdown open/closed
- Cart count from CartContext

#### 2. Avatar Component

**Location**: `frontend/components/Avatar.tsx`

**Purpose**: Display user profile picture or initials-based placeholder.

**Features**:

- Image display if avatar URL exists
- Colored circle with initials if no image
- Consistent color generation based on user ID
- Click handler for dropdown menu

**Props**:

```typescript
interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}
```

#### 3. Sidebar Component

**Location**: `frontend/components/Sidebar.tsx`

**Purpose**: Left sidebar with expandable product categories and offers menu.

**Features**:

- Collapsible categories list
- Active category highlighting
- "All Categories" option
- Offers link

**Props**:

```typescript
interface SidebarProps {
  categories: Category[];
  activeCategory?: string;
  onCategorySelect: (categoryId: string | null) => void;
}
```

#### 4. Carousel Component

**Location**: `frontend/components/Carousel.tsx`

**Purpose**: Auto-scrolling image carousel for promotional offers.

**Features**:

- Auto-advance every 5 seconds
- Manual navigation (prev/next)
- Indicator dots
- Pause on hover

**Props**:

```typescript
interface CarouselProps {
  offers: Offer[];
  autoPlayInterval?: number;
}
```

#### 5. Navigation History Component

**Location**: `frontend/components/NavigationHistory.tsx`

**Purpose**: Display recently viewed products with circular navigation.

**Features**:

- Show up to 10 recent products
- Horizontal scroll with arrows
- Loop to beginning when reaching end
- Product card preview

**Props**:

```typescript
interface NavigationHistoryProps {
  products: Product[];
}
```

#### 6. Product Grid Component

**Location**: `frontend/components/ProductGrid.tsx`

**Purpose**: Display products in a 5-column grid with pagination.

**Features**:

- 5 columns × 10 rows layout
- Heart icon for favorites
- Product card with image, name, price, rating
- Pagination controls

**Props**:

```typescript
interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFavoriteToggle: (productId: string) => void;
  favorites: string[];
}
```

#### 7. Product Filters Component

**Location**: `frontend/components/ProductFilters.tsx`

**Purpose**: Advanced filtering and sorting controls.

**Features**:

- Category filter dropdown
- Sort by: Price, Alphabetical, Rating
- Sort order toggle (asc/desc)
- Active filter indicators

**Props**:

```typescript
interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  sortBy: 'price' | 'name' | 'rating';
  sortOrder: 'asc' | 'desc';
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (sortBy: string, order: string) => void;
}
```

#### 8. Checkout Modal Component

**Location**: `frontend/components/CheckoutModal.tsx`

**Purpose**: Confirmation dialog before finalizing order.

**Features**:

- Order summary with all details
- Product list with quantities and prices
- Delivery information display
- Payment method selection (Card, Cash on Delivery)
- Total calculation with discounts
- Modify, Cancel, Confirm buttons

**Props**:

```typescript
interface CheckoutModalProps {
  isOpen: boolean;
  order: OrderSummary;
  paymentMethod: 'CARD' | 'CASH_ON_DELIVERY';
  onPaymentMethodChange: (method: string) => void;
  onModify: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}
```

#### 9. Contact Page Component

**Location**: `frontend/app/contact/page.tsx`

**Purpose**: Display contact information with active phone and email links.

**Features**:

- Display business contact information
- Clickable phone number (tel: link)
- Clickable email address (mailto: link)
- Contact form for inquiries
- Map or address display

#### 10. About Page Component

**Location**: `frontend/app/about/page.tsx`

**Purpose**: Display information about the business.

**Features**:

- Company description
- Mission and values
- Team information
- History or story

#### 11. Admin Dashboard Components

**Location**: `frontend/components/admin/`

**Components**:

- `OrdersManagement.tsx` - CRUD for orders with status updates
- `ProductsManagement.tsx` - CRUD for products with stock management
- `OffersManagement.tsx` - CRUD for promotional offers
- `UsersManagement.tsx` - User management with role changes
- `VouchersManagement.tsx` - Voucher CRUD and request approvals

### Backend API Endpoints

#### Authentication Routes

```typescript
POST / api / auth / register; // Register new user
POST / api / auth / login; // Login user
POST / api / auth / logout; // Logout user
GET / api / auth / me; // Get current user
```

#### User Routes

```typescript
GET / api / users / profile; // Get user profile
PUT / api / users / profile; // Update profile
POST / api / users / avatar; // Upload avatar
PUT / api / users / password; // Change password
```

#### Product Routes

```typescript
GET    /api/products               // Get all products (with filters, sort, pagination)
GET    /api/products/:id           // Get product details
POST   /api/products               // Create product (admin)
PUT    /api/products/:id           // Update product (admin)
DELETE /api/products/:id           // Delete product (admin)
PUT    /api/products/:id/stock     // Update stock (admin)
```

#### Favorites Routes

```typescript
GET    /api/favorites              // Get user favorites
POST   /api/favorites/:productId   // Add to favorites
DELETE /api/favorites/:productId   // Remove from favorites
```

#### Cart Routes

```typescript
GET    /api/cart                   // Get user cart
POST   /api/cart/items             // Add item to cart
PUT    /api/cart/items/:id         // Update cart item quantity
DELETE /api/cart/items/:id         // Remove item from cart
PUT    /api/cart/delivery          // Update delivery information
DELETE /api/cart/delivery          // Clear delivery information
```

#### Order Routes

```typescript
GET    /api/orders                 // Get user orders
GET    /api/orders/:id             // Get order details
POST   /api/orders                 // Create order from cart
PUT    /api/orders/:id/status      // Update order status (admin)
DELETE /api/orders/:id             // Delete order (admin)
```

#### Voucher Routes

```typescript
GET    /api/vouchers               // Get user vouchers
POST   /api/vouchers/request       // Create voucher request
GET    /api/vouchers/requests      // Get all requests (admin)
PUT    /api/vouchers/requests/:id  // Approve/reject request (admin)
POST   /api/vouchers               // Create voucher (admin)
PUT    /api/vouchers/:id           // Update voucher (admin)
DELETE /api/vouchers/:id           // Delete voucher (admin)
POST   /api/vouchers/:id/send      // Send voucher to user (admin)
```

#### Offer Routes

```typescript
GET    /api/offers                 // Get active offers
GET    /api/offers/all             // Get all offers (admin)
POST   /api/offers                 // Create offer (admin)
PUT    /api/offers/:id             // Update offer (admin)
DELETE /api/offers/:id             // Delete offer (admin)
```

#### Admin Routes

```typescript
GET    /api/admin/users            // Get all users
POST   /api/admin/users            // Create user
PUT    /api/admin/users/:id        // Update user
DELETE /api/admin/users/:id        // Delete user
PUT    /api/admin/users/:id/role   // Change user role
GET    /api/admin/orders           // Get all orders
PUT    /api/admin/orders/:id       // Update order
DELETE /api/admin/orders/:id       // Delete order
```

#### Navigation History Routes

```typescript
GET    /api/history                // Get navigation history
POST   /api/history/:productId     // Add product to history
```

#### Search Routes

```typescript
GET    /api/search?q=query         // Search products
```

#### Contact Routes

```typescript
GET / api / contact; // Get contact information
```

## Data Models

### Extended Prisma Schema

```prisma
model User {
  id                String             @id @default(uuid())
  email             String             @unique
  password          String
  name              String
  phone             String?
  address           String?
  avatar            String?            // URL to avatar image
  role              Role               @default(USER)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  orders            Order[]
  reviews           Review[]
  favorites         Favorite[]
  cartItems         CartItem[]
  vouchers          UserVoucher[]
  voucherRequests   VoucherRequest[]
  navigationHistory NavigationHistory[]
}

enum Role {
  USER
  ADMIN
}

model Product {
  id          String     @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int
  image       String
  categoryId  String
  rating      Float      @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  category    Category   @relation(fields: [categoryId], references: [id])
  reviews     Review[]
  favorites   Favorite[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  offers      ProductOffer[]
  navigationHistory NavigationHistory[]
}

model Category {
  id        String    @id @default(uuid())
  name      String    @unique
  products  Product[]
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  productId String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}

model Order {
  id              String        @id @default(uuid())
  userId          String
  status          OrderStatus   @default(PROCESSING)
  total           Float
  deliveryAddress String
  deliveryPhone   String
  deliveryName    String
  paymentMethod   PaymentMethod @default(CASH_ON_DELIVERY)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user            User          @relation(fields: [userId], references: [id])
  items           OrderItem[]
  voucherUsed     UserVoucher?
}

enum OrderStatus {
  PROCESSING
  PREPARING
  SHIPPING
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CARD
  CASH_ON_DELIVERY
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Float

  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])
}

model CartItem {
  id        String   @id @default(uuid())
  userId    String
  productId String
  quantity  Int
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}

model Voucher {
  id          String          @id @default(uuid())
  code        String          @unique
  discount    Float           // Percentage or fixed amount
  discountType DiscountType   @default(PERCENTAGE)
  maxUsage    Int
  usedCount   Int             @default(0)
  validFrom   DateTime
  validUntil  DateTime
  createdAt   DateTime        @default(now())

  userVouchers UserVoucher[]
}

enum DiscountType {
  PERCENTAGE
  FIXED
}

model UserVoucher {
  id         String    @id @default(uuid())
  userId     String
  voucherId  String
  usedAt     DateTime?
  orderId    String?   @unique

  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  voucher    Voucher   @relation(fields: [voucherId], references: [id], onDelete: Cascade)
  order      Order?    @relation(fields: [orderId], references: [id])

  @@unique([userId, voucherId])
}

model VoucherRequest {
  id          String              @id @default(uuid())
  userId      String
  description String
  status      VoucherRequestStatus @default(PENDING)
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum VoucherRequestStatus {
  PENDING
  APPROVED
  REJECTED
}

model Offer {
  id          String         @id @default(uuid())
  title       String
  description String
  image       String
  discount    Float          // Percentage
  validFrom   DateTime
  validUntil  DateTime
  active      Boolean        @default(true)
  createdAt   DateTime       @default(now())

  products    ProductOffer[]
}

model ProductOffer {
  id        String   @id @default(uuid())
  productId String
  offerId   String

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  offer     Offer    @relation(fields: [offerId], references: [id], onDelete: Cascade)

  @@unique([productId, offerId])
}

model NavigationHistory {
  id        String   @id @default(uuid())
  userId    String
  productId String
  viewedAt  DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([userId, viewedAt])
}

model Review {
  id        String   @id @default(uuid())
  userId    String
  productId String
  rating    Int
  comment   String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}
```

## Error Handling

### Frontend Error Handling

1. **API Error Interceptor**: Centralized error handling for all API calls
2. **Toast Notifications**: User-friendly error messages
3. **Form Validation**: Client-side validation before submission
4. **Fallback UI**: Error boundaries for component failures

### Backend Error Handling

1. **Global Error Handler**: Fastify error handler for all routes
2. **Validation Errors**: Detailed validation error messages
3. **Authentication Errors**: 401 for unauthorized, 403 for forbidden
4. **Database Errors**: Proper error mapping for Prisma errors
5. **File Upload Errors**: Size and type validation

## Testing Strategy

### Unit Tests

1. **Backend Services**: Test business logic in isolation

   - User service (profile updates, avatar upload)
   - Product service (CRUD, stock management)
   - Voucher service (creation, expiration, usage)
   - Offer service (discount calculation)

2. **Frontend Components**: Test component rendering and interactions
   - Avatar component (initials generation, image display)
   - Navbar component (dropdown, search)
   - Product filters (sorting, filtering)
   - Checkout modal (order summary, actions)

### Integration Tests

1. **API Endpoints**: Test complete request/response cycles

   - Authentication flow
   - Product filtering and pagination
   - Cart to order conversion
   - Voucher application
   - Admin operations

2. **Database Operations**: Test Prisma queries
   - Complex joins (products with offers)
   - Cascading deletes
   - Transaction handling

### End-to-End Tests

1. **User Flows**:

   - Complete purchase flow (browse → cart → checkout → order)
   - Favorite products and view favorites
   - Create voucher request and use approved voucher
   - Profile update with avatar upload

2. **Admin Flows**:
   - Create product and offer
   - Manage order status
   - Approve voucher requests
   - Change user roles

## Performance Considerations

### Frontend Optimization

1. **Code Splitting**: Lazy load admin components
2. **Image Optimization**: Next.js Image component for all images
3. **Caching**: Cache product lists and categories
4. **Debouncing**: Search input debouncing
5. **Virtual Scrolling**: For large product lists

### Backend Optimization

1. **Database Indexing**: Index frequently queried fields
2. **Query Optimization**: Use Prisma select to fetch only needed fields
3. **Caching**: Redis cache for product lists and offers
4. **Pagination**: Limit query results
5. **Connection Pooling**: Prisma connection pool configuration

### Scheduled Jobs

1. **Voucher Expiration**: Daily cron job to delete expired vouchers
2. **Offer Expiration**: Hourly check to deactivate expired offers
3. **Navigation History Cleanup**: Weekly cleanup of old history (keep last 30 days)

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control for admin routes
3. **File Upload**: Validate file types and sizes for avatars and product images
4. **SQL Injection**: Prisma ORM prevents SQL injection
5. **XSS Protection**: Sanitize user inputs
6. **CSRF Protection**: CSRF tokens for state-changing operations
7. **Rate Limiting**: Limit API requests per user
8. **Password Security**: bcrypt hashing with salt rounds

## Deployment Considerations

1. **Environment Variables**: Separate configs for dev/staging/production
2. **Database Migrations**: Automated migration on deployment
3. **File Storage**: Use cloud storage (S3, Cloudinary) for production images
4. **CDN**: Serve static assets through CDN
5. **Monitoring**: Error tracking and performance monitoring
6. **Backup**: Automated database backups
7. **Scaling**: Horizontal scaling for backend services
