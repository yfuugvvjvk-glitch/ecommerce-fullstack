# Design Document: Sistem Produse Cadou

## 1. Overview

Acest document descrie designul tehnic pentru sistemul de produse cadou care permite adminilor să creeze reguli complexe de oferire a cadourilor și clienților să primească produse gratuite când îndeplinesc anumite condiții.

### 1.1 Obiective Principale

- Gestionare flexibilă a regulilor de cadou cu condiții complexe (AND/OR)
- Validare în timp real a condițiilor la modificarea coșului
- Integrare seamless cu sistemul existent de coș, comenzi și stoc
- Interfață intuitivă pentru admin și client
- Performanță ridicată pentru evaluarea condițiilor

### 1.2 Stack Tehnologic

- **Backend**: Fastify + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Frontend**: React + TypeScript
- **State Management**: React Context API / Zustand
- **API Communication**: Axios

## 2. Architecture

### 2.1 Arhitectură Generală

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Admin Panel  │  │   Checkout   │  │  Cart View   │     │
│  │ Gift Rules   │  │ Gift Section │  │ Gift Display │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Gift Rule    │  │  Condition   │  │  Cart        │     │
│  │ Service      │  │  Evaluator   │  │  Service     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Stock        │  │  Order       │  │  Gift        │     │
│  │ Service      │  │  Service     │  │  Validator   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
```

┌─────────────────────────────────────────────────────────────┐
│ Database Layer │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ GiftRule │ │ GiftCondition│ │ GiftProduct │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ OrderItem │ │ CartItem │ │ DataItem │ │
│ │ (extended) │ │ (extended) │ │ (Product) │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘

````

### 2.2 Fluxul de Date

1. **Admin creează regulă** → GiftRuleService → Database
2. **Client modifică coș** → CartService → ConditionEvaluator → GiftRuleService
3. **Evaluare condiții** → ConditionEvaluator → returnează reguli eligibile
4. **Client selectează cadou** → CartService → GiftValidator → adaugă în coș
5. **Plasare comandă** → OrderService → verifică validitate → decrementează stoc

## 3. Components and Interfaces

### 3.1 Database Schema (Prisma Models)

#### 3.1.1 GiftRule Model

```prisma
model GiftRule {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text
  isActive    Boolean  @default(true)
  priority    Int      @default(50) // 1-100, mai mare = prioritate mai mare

  // Logic pentru combinarea condițiilor
  conditionLogic String @default("AND") // "AND" sau "OR"

  // Limite de utilizare
  maxUsesPerCustomer Int?     // null = unlimited
  maxTotalUses       Int?     // null = unlimited
  currentTotalUses   Int      @default(0)

  // Validitate temporală
  validFrom   DateTime?
  validUntil  DateTime?

  // Metadata
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relații
  createdBy      User            @relation("GiftRuleCreator", fields: [createdById], references: [id], onDelete: Cascade)
  conditions     GiftCondition[]
  giftProducts   GiftProduct[]
  orderItems     OrderItem[]     @relation("GiftRuleOrderItems")
  cartItems      CartItem[]      @relation("GiftRuleCartItems")
  usageHistory   GiftRuleUsage[]

  @@index([isActive])
  @@index([priority])
  @@index([validFrom])
  @@index([validUntil])
  @@index([createdById])
}
````

#### 3.1.2 GiftCondition Model

```prisma
model GiftCondition {
  id         String @id @default(cuid())
  giftRuleId String

  // Tipul condiției
  type String // "MIN_AMOUNT", "SPECIFIC_PRODUCT", "PRODUCT_CATEGORY", "PRODUCT_QUANTITY"

  // Parametri pentru MIN_AMOUNT
  minAmount Float?

  // Parametri pentru SPECIFIC_PRODUCT
  productId   String?
  minQuantity Int?    @default(1)

  // Parametri pentru PRODUCT_CATEGORY
  categoryId       String?
  minCategoryAmount Float?

  // Pentru condiții imbricate (suport pentru logică complexă)
  parentConditionId String?
  logic             String? // "AND" sau "OR" pentru sub-condiții

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relații
  giftRule         GiftRule         @relation(fields: [giftRuleId], references: [id], onDelete: Cascade)
  product          DataItem?        @relation("ConditionProduct", fields: [productId], references: [id], onDelete: Cascade)
  category         Category?        @relation("ConditionCategory", fields: [categoryId], references: [id], onDelete: Cascade)
  parentCondition  GiftCondition?   @relation("NestedConditions", fields: [parentConditionId], references: [id], onDelete: Cascade)
  subConditions    GiftCondition[]  @relation("NestedConditions")

  @@index([giftRuleId])
  @@index([type])
  @@index([productId])
  @@index([categoryId])
  @@index([parentConditionId])
}
```

#### 3.1.3 GiftProduct Model

```prisma
model GiftProduct {
  id         String @id @default(cuid())
  giftRuleId String
  productId  String

  // Limite per regulă
  maxQuantityPerOrder Int  @default(1) // Câte pot fi oferite per comandă
  remainingStock      Int? // null = folosește stocul produsului real

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relații
  giftRule GiftRule @relation(fields: [giftRuleId], references: [id], onDelete: Cascade)
  product  DataItem @relation("GiftProductItem", fields: [productId], references: [id], onDelete: Cascade)

  @@unique([giftRuleId, productId])
  @@index([giftRuleId])
  @@index([productId])
}
```

#### 3.1.4 GiftRuleUsage Model (pentru tracking)

```prisma
model GiftRuleUsage {
  id         String   @id @default(cuid())
  giftRuleId String
  userId     String
  orderId    String
  productId  String   // Produsul cadou selectat
  usedAt     DateTime @default(now())

  // Relații
  giftRule GiftRule @relation(fields: [giftRuleId], references: [id], onDelete: Cascade)
  user     User     @relation("GiftRuleUsageUser", fields: [userId], references: [id], onDelete: Cascade)
  order    Order    @relation("GiftRuleUsageOrder", fields: [orderId], references: [id], onDelete: Cascade)
  product  DataItem @relation("GiftRuleUsageProduct", fields: [productId], references: [id], onDelete: Cascade)

  @@index([giftRuleId])
  @@index([userId])
  @@index([orderId])
  @@index([usedAt])
}
```

#### 3.1.5 Extended OrderItem Model

```prisma
// Adăugăm câmpuri noi la modelul OrderItem existent
model OrderItem {
  // ... câmpuri existente ...

  // Câmpuri noi pentru cadouri
  isGift        Boolean @default(false)
  giftRuleId    String?
  originalPrice Float?  // Prețul original al produsului (pentru raportare)

  // Relație nouă
  giftRule GiftRule? @relation("GiftRuleOrderItems", fields: [giftRuleId], references: [id], onDelete: SetNull)

  @@index([isGift])
  @@index([giftRuleId])
}
```

#### 3.1.6 Extended CartItem Model

```prisma
// Adăugăm câmpuri noi la modelul CartItem existent
model CartItem {
  // ... câmpuri existente ...

  // Câmpuri noi pentru cadouri
  isGift     Boolean @default(false)
  giftRuleId String?

  // Relație nouă
  giftRule GiftRule? @relation("GiftRuleCartItems", fields: [giftRuleId], references: [id], onDelete: SetNull)

  @@index([isGift])
  @@index([giftRuleId])
}
```

#### 3.1.7 Extended User Model

```prisma
// Adăugăm relații noi la modelul User existent
model User {
  // ... câmpuri și relații existente ...

  // Relații noi pentru gift system
  createdGiftRules GiftRule[]      @relation("GiftRuleCreator")
  giftRuleUsages   GiftRuleUsage[] @relation("GiftRuleUsageUser")
}
```

#### 3.1.8 Extended DataItem Model

```prisma
// Adăugăm relații noi la modelul DataItem existent
model DataItem {
  // ... câmpuri și relații existente ...

  // Relații noi pentru gift system
  giftProducts       GiftProduct[]     @relation("GiftProductItem")
  conditionProducts  GiftCondition[]   @relation("ConditionProduct")
  giftRuleUsages     GiftRuleUsage[]   @relation("GiftRuleUsageProduct")
}
```

#### 3.1.9 Extended Category Model

```prisma
// Adăugăm relații noi la modelul Category existent
model Category {
  // ... câmpuri și relații existente ...

  // Relații noi pentru gift system
  giftConditions GiftCondition[] @relation("ConditionCategory")
}
```

#### 3.1.10 Extended Order Model

```prisma
// Adăugăm relații noi la modelul Order existent
model Order {
  // ... câmpuri și relații existente ...

  // Relații noi pentru gift system
  giftRuleUsages GiftRuleUsage[] @relation("GiftRuleUsageOrder")
}
```

### 3.2 TypeScript Interfaces

#### 3.2.1 Core Interfaces

```typescript
// Tipuri pentru condiții
type ConditionType =
  | 'MIN_AMOUNT'
  | 'SPECIFIC_PRODUCT'
  | 'PRODUCT_CATEGORY'
  | 'PRODUCT_QUANTITY';

type ConditionLogic = 'AND' | 'OR';

// Interface pentru condiție
interface GiftConditionData {
  id: string;
  type: ConditionType;
  minAmount?: number;
  productId?: string;
  minQuantity?: number;
  categoryId?: string;
  minCategoryAmount?: number;
  logic?: ConditionLogic;
  subConditions?: GiftConditionData[];
}

// Interface pentru produs cadou
interface GiftProductData {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
    stock: number;
  };
  maxQuantityPerOrder: number;
  remainingStock: number | null;
}

// Interface pentru regulă cadou
interface GiftRuleData {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  priority: number;
  conditionLogic: ConditionLogic;
  conditions: GiftConditionData[];
  giftProducts: GiftProductData[];
  maxUsesPerCustomer: number | null;
  maxTotalUses: number | null;
  currentTotalUses: number;
  validFrom: Date | null;
  validUntil: Date | null;
}

// Interface pentru rezultatul evaluării
interface EvaluationResult {
  isEligible: boolean;
  rule: GiftRuleData;
  reason?: string; // Motivul pentru care nu este eligibil
}

// Interface pentru coș cu produse
interface CartItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  isGift: boolean;
  giftRuleId: string | null;
  product: {
    id: string;
    title: string;
    price: number;
    categoryId: string;
    stock: number;
  };
}

// Interface pentru context evaluare
interface EvaluationContext {
  cartItems: CartItemWithProduct[];
  userId: string;
  subtotal: number;
  existingGiftRuleIds: string[]; // Regulile deja folosite în coș
}
```

#### 3.2.2 API Request/Response Interfaces

```typescript
// Request pentru creare regulă
interface CreateGiftRuleRequest {
  name: string;
  description?: string;
  priority: number;
  conditionLogic: ConditionLogic;
  conditions: Omit<GiftConditionData, 'id'>[];
  giftProductIds: string[];
  maxUsesPerCustomer?: number;
  maxTotalUses?: number;
  validFrom?: string; // ISO date string
  validUntil?: string; // ISO date string
}

// Response pentru evaluare reguli
interface EvaluateGiftRulesResponse {
  eligibleRules: Array<{
    rule: GiftRuleData;
    availableProducts: GiftProductData[];
  }>;
}

// Request pentru adăugare cadou în coș
interface AddGiftToCartRequest {
  giftRuleId: string;
  productId: string;
}

// Response pentru adăugare cadou
interface AddGiftToCartResponse {
  success: boolean;
  message: string;
  cartItem?: CartItemWithProduct;
  cart?: {
    items: CartItemWithProduct[];
    subtotal: number;
    total: number;
  };
}
```

### 3.3 Service Interfaces

#### 3.3.1 GiftRuleService

```typescript
interface IGiftRuleService {
  // CRUD operations
  createRule(
    data: CreateGiftRuleRequest,
    userId: string
  ): Promise<GiftRuleData>;
  updateRule(
    id: string,
    data: Partial<CreateGiftRuleRequest>
  ): Promise<GiftRuleData>;
  deleteRule(id: string): Promise<void>;
  getRule(id: string): Promise<GiftRuleData | null>;
  getAllRules(includeInactive?: boolean): Promise<GiftRuleData[]>;
  getActiveRules(): Promise<GiftRuleData[]>;

  // Toggle status
  toggleRuleStatus(id: string, isActive: boolean): Promise<GiftRuleData>;

  // Statistics
  getRuleStatistics(id: string): Promise<{
    totalUses: number;
    uniqueUsers: number;
    totalValueGiven: number;
    usageByProduct: Array<{ productId: string; count: number }>;
  }>;
}
```

#### 3.3.2 ConditionEvaluator

```typescript
interface IConditionEvaluator {
  // Evaluare regulă completă
  evaluateRule(
    rule: GiftRuleData,
    context: EvaluationContext
  ): Promise<EvaluationResult>;

  // Evaluare condiție individuală
  evaluateCondition(
    condition: GiftConditionData,
    context: EvaluationContext
  ): Promise<boolean>;

  // Evaluare toate regulile active
  evaluateAllRules(context: EvaluationContext): Promise<EvaluationResult[]>;

  // Verificare dacă utilizatorul a atins limita
  checkUserLimit(
    userId: string,
    ruleId: string,
    maxUses: number | null
  ): Promise<boolean>;
}
```

#### 3.3.3 GiftValidator

```typescript
interface IGiftValidator {
  // Validare înainte de adăugare în coș
  validateGiftSelection(
    userId: string,
    giftRuleId: string,
    productId: string,
    currentCart: CartItemWithProduct[]
  ): Promise<{
    isValid: boolean;
    error?: string;
  }>;

  // Validare stoc pentru produs cadou
  validateGiftStock(productId: string, giftRuleId: string): Promise<boolean>;

  // Validare înainte de plasare comandă
  validateGiftsInOrder(
    userId: string,
    cartItems: CartItemWithProduct[]
  ): Promise<{
    isValid: boolean;
    invalidGifts: string[];
    errors: string[];
  }>;
}
```

#### 3.3.4 CartService Extensions

```typescript
interface ICartServiceExtensions {
  // Adăugare produs cadou
  addGiftProduct(
    userId: string,
    giftRuleId: string,
    productId: string
  ): Promise<AddGiftToCartResponse>;

  // Eliminare produs cadou
  removeGiftProduct(
    userId: string,
    cartItemId: string
  ): Promise<{ success: boolean; message: string }>;

  // Reevaluare cadouri după modificare coș
  reevaluateGifts(userId: string): Promise<{
    removedGifts: string[];
    eligibleRules: GiftRuleData[];
  }>;

  // Obținere cadouri eligibile
  getEligibleGifts(userId: string): Promise<EvaluateGiftRulesResponse>;
}
```

## 4. Data Models

### 4.1 Structura Condițiilor

Condițiile pot fi simple sau complexe (imbricate). Exemplu de structură:

```typescript
// Condiție simplă: Sumă minimă
{
  type: 'MIN_AMOUNT',
  minAmount: 200
}

// Condiție simplă: Produs specific
{
  type: 'SPECIFIC_PRODUCT',
  productId: 'prod_123',
  minQuantity: 2
}

// Condiție complexă: (Sumă >= 200) AND (Produs X OR Categorie Y)
{
  type: 'MIN_AMOUNT',
  minAmount: 200,
  logic: 'AND',
  subConditions: [
    {
      type: 'SPECIFIC_PRODUCT',
      productId: 'prod_123',
      logic: 'OR'
    },
    {
      type: 'PRODUCT_CATEGORY',
      categoryId: 'cat_456'
    }
  ]
}
```

### 4.2 Fluxul de Date în Evaluare

```
1. User modifică coșul
   ↓
2. CartService.reevaluateGifts()
   ↓
3. Construiește EvaluationContext
   {
     cartItems: [...],
     userId: "user_123",
     subtotal: 250,
     existingGiftRuleIds: ["rule_1"]
   }
   ↓
4. ConditionEvaluator.evaluateAllRules(context)
   ↓
5. Pentru fiecare regulă activă:
   - Verifică validitate temporală
   - Verifică limită utilizări
   - Evaluează condiții (recursiv pentru imbricate)
   ↓
6. Returnează reguli eligibile
   ↓
7. GiftValidator.validateGiftStock() pentru fiecare produs
   ↓
8. Returnează produse disponibile către frontend
```

### 4.3 State Management (Frontend)

```typescript
// Context pentru gift system
interface GiftContext {
  // State
  eligibleRules: GiftRuleData[];
  selectedGifts: Map<string, string>; // ruleId -> productId
  isEvaluating: boolean;
  error: string | null;

  // Actions
  evaluateGifts: () => Promise<void>;
  selectGift: (ruleId: string, productId: string) => Promise<void>;
  removeGift: (cartItemId: string) => Promise<void>;
  clearError: () => void;
}

// Hook pentru utilizare
const useGiftSystem = () => {
  const context = useContext(GiftContext);
  if (!context) {
    throw new Error('useGiftSystem must be used within GiftProvider');
  }
  return context;
};
```

## 5. Condition Evaluation Algorithm

### 5.1 Algoritmul Principal

```typescript
async function evaluateRule(
  rule: GiftRuleData,
  context: EvaluationContext
): Promise<EvaluationResult> {
  // 1. Verifică dacă regula este activă
  if (!rule.isActive) {
    return { isEligible: false, rule, reason: 'Rule is not active' };
  }

  // 2. Verifică validitatea temporală
  const now = new Date();
  if (rule.validFrom && now < rule.validFrom) {
    return { isEligible: false, rule, reason: 'Rule not yet valid' };
  }
  if (rule.validUntil && now > rule.validUntil) {
    return { isEligible: false, rule, reason: 'Rule expired' };
  }

  // 3. Verifică limita totală de utilizări
  if (rule.maxTotalUses && rule.currentTotalUses >= rule.maxTotalUses) {
    return { isEligible: false, rule, reason: 'Rule usage limit reached' };
  }

  // 4. Verifică limita per utilizator
  if (rule.maxUsesPerCustomer) {
    const userUsageCount = await getUserUsageCount(context.userId, rule.id);
    if (userUsageCount >= rule.maxUsesPerCustomer) {
      return { isEligible: false, rule, reason: 'User usage limit reached' };
    }
  }

  // 5. Verifică dacă utilizatorul deja are un cadou din această regulă
  if (context.existingGiftRuleIds.includes(rule.id)) {
    return {
      isEligible: false,
      rule,
      reason: 'Gift already selected from this rule',
    };
  }

  // 6. Evaluează condițiile
  const conditionsResult = await evaluateConditions(
    rule.conditions,
    rule.conditionLogic,
    context
  );

  if (!conditionsResult) {
    return { isEligible: false, rule, reason: 'Conditions not met' };
  }

  return { isEligible: true, rule };
}
```

### 5.2 Evaluare Condiții (Recursiv)

```typescript
async function evaluateConditions(
  conditions: GiftConditionData[],
  logic: ConditionLogic,
  context: EvaluationContext
): Promise<boolean> {
  if (conditions.length === 0) return true;

  const results = await Promise.all(
    conditions.map((condition) => evaluateSingleCondition(condition, context))
  );

  if (logic === 'AND') {
    return results.every((r) => r === true);
  } else {
    // OR
    return results.some((r) => r === true);
  }
}

async function evaluateSingleCondition(
  condition: GiftConditionData,
  context: EvaluationContext
): Promise<boolean> {
  // Dacă are sub-condiții, evaluează recursiv
  if (condition.subConditions && condition.subConditions.length > 0) {
    return evaluateConditions(
      condition.subConditions,
      condition.logic || 'AND',
      context
    );
  }

  // Evaluează condiția în funcție de tip
  switch (condition.type) {
    case 'MIN_AMOUNT':
      return evaluateMinAmount(condition, context);

    case 'SPECIFIC_PRODUCT':
      return evaluateSpecificProduct(condition, context);

    case 'PRODUCT_CATEGORY':
      return evaluateProductCategory(condition, context);

    case 'PRODUCT_QUANTITY':
      return evaluateProductQuantity(condition, context);

    default:
      return false;
  }
}
```

### 5.3 Evaluatori Specifici

```typescript
function evaluateMinAmount(
  condition: GiftConditionData,
  context: EvaluationContext
): boolean {
  if (!condition.minAmount) return false;

  // Calculează subtotal fără produsele cadou
  const subtotal = context.cartItems
    .filter((item) => !item.isGift)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return subtotal >= condition.minAmount;
}

function evaluateSpecificProduct(
  condition: GiftConditionData,
  context: EvaluationContext
): boolean {
  if (!condition.productId) return false;

  const productInCart = context.cartItems.find(
    (item) => !item.isGift && item.productId === condition.productId
  );

  if (!productInCart) return false;

  const minQty = condition.minQuantity || 1;
  return productInCart.quantity >= minQty;
}

function evaluateProductCategory(
  condition: GiftConditionData,
  context: EvaluationContext
): boolean {
  if (!condition.categoryId) return false;

  const categoryItems = context.cartItems.filter(
    (item) => !item.isGift && item.product.categoryId === condition.categoryId
  );

  if (categoryItems.length === 0) return false;

  // Dacă există minCategoryAmount, verifică suma
  if (condition.minCategoryAmount) {
    const categoryTotal = categoryItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return categoryTotal >= condition.minCategoryAmount;
  }

  return true;
}

function evaluateProductQuantity(
  condition: GiftConditionData,
  context: EvaluationContext
): boolean {
  if (!condition.productId) return false;

  const productInCart = context.cartItems.find(
    (item) => !item.isGift && item.productId === condition.productId
  );

  if (!productInCart) return false;

  const minQty = condition.minQuantity || 1;
  return productInCart.quantity >= minQty;
}
```

### 5.4 Optimizări pentru Performanță

```typescript
// Cache pentru reguli active (invalidat la modificare)
const activeRulesCache = new Map<
  string,
  { rules: GiftRuleData[]; timestamp: number }
>();
const CACHE_TTL = 60000; // 1 minut

async function getActiveRulesWithCache(): Promise<GiftRuleData[]> {
  const cached = activeRulesCache.get('active');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.rules;
  }

  const rules = await prisma.giftRule.findMany({
    where: { isActive: true },
    include: {
      conditions: {
        include: {
          product: true,
          category: true,
          subConditions: true,
        },
      },
      giftProducts: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { priority: 'desc' },
  });

  activeRulesCache.set('active', { rules, timestamp: Date.now() });
  return rules;
}

// Invalidare cache la modificare regulă
function invalidateRulesCache() {
  activeRulesCache.clear();
}
```

## 6. API Endpoints Specification

### 6.1 Admin Endpoints

#### POST /api/admin/gift-rules

Creează o regulă nouă de cadou.

**Authentication**: Admin required

**Request Body**:

```typescript
{
  name: string;
  description?: string;
  priority: number; // 1-100
  conditionLogic: "AND" | "OR";
  conditions: Array<{
    type: "MIN_AMOUNT" | "SPECIFIC_PRODUCT" | "PRODUCT_CATEGORY" | "PRODUCT_QUANTITY";
    minAmount?: number;
    productId?: string;
    minQuantity?: number;
    categoryId?: string;
    minCategoryAmount?: number;
    logic?: "AND" | "OR";
    subConditions?: Array<...>; // Recursiv
  }>;
  giftProductIds: string[];
  maxUsesPerCustomer?: number;
  maxTotalUses?: number;
  validFrom?: string; // ISO date
  validUntil?: string; // ISO date
}
```

**Response** (201 Created):

```typescript
{
  success: true;
  rule: GiftRuleData;
}
```

**Errors**:

- 400: Invalid request data
- 401: Unauthorized
- 403: Forbidden (not admin)

#### GET /api/admin/gift-rules

Returnează toate regulile (active și inactive).

**Authentication**: Admin required

**Query Parameters**:

- `includeInactive`: boolean (default: true)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response** (200 OK):

```typescript
{
  success: true;
  rules: GiftRuleData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### GET /api/admin/gift-rules/:id

Returnează o regulă specifică.

**Authentication**: Admin required

**Response** (200 OK):

```typescript
{
  success: true;
  rule: GiftRuleData;
}
```

**Errors**:

- 404: Rule not found

#### PUT /api/admin/gift-rules/:id

Actualizează o regulă existentă.

**Authentication**: Admin required

**Request Body**: Same as POST (partial update allowed)

**Response** (200 OK):

```typescript
{
  success: true;
  rule: GiftRuleData;
}
```

#### DELETE /api/admin/gift-rules/:id

Șterge o regulă.

**Authentication**: Admin required

**Response** (200 OK):

```typescript
{
  success: true;
  message: 'Rule deleted successfully';
}
```

#### PATCH /api/admin/gift-rules/:id/toggle

Activează/dezactivează o regulă.

**Authentication**: Admin required

**Request Body**:

```typescript
{
  isActive: boolean;
}
```

**Response** (200 OK):

```typescript
{
  success: true;
  rule: GiftRuleData;
}
```

#### GET /api/admin/gift-rules/:id/statistics

Returnează statistici pentru o regulă.

**Authentication**: Admin required

**Response** (200 OK):

```typescript
{
  success: true;
  statistics: {
    totalUses: number;
    uniqueUsers: number;
    totalValueGiven: number;
    usageByProduct: Array<{
      productId: string;
      productName: string;
      count: number;
      totalValue: number;
    }>;
    usageOverTime: Array<{
      date: string;
      count: number;
    }>;
  }
}
```

### 6.2 Client Endpoints

#### GET /api/gift-rules/active

Returnează regulile active (pentru afișare publică).

**Authentication**: Optional

**Response** (200 OK):

```typescript
{
  success: true;
  rules: Array<{
    id: string;
    name: string;
    description: string;
    // Fără detalii sensibile despre condiții
  }>;
}
```

#### POST /api/cart/evaluate-gift-rules

Evaluează ce reguli sunt îndeplinite pentru coșul curent.

**Authentication**: User required

**Request Body**:

```typescript
{
  // Body poate fi gol, se folosește coșul utilizatorului autentificat
}
```

**Response** (200 OK):

```typescript
{
  success: true;
  eligibleRules: Array<{
    rule: {
      id: string;
      name: string;
      description: string;
    };
    availableProducts: Array<{
      id: string;
      productId: string;
      product: {
        id: string;
        title: string;
        image: string;
        price: number;
        stock: number;
      };
      maxQuantityPerOrder: number;
    }>;
  }>;
}
```

#### POST /api/cart/add-gift-product

Adaugă un produs cadou în coș.

**Authentication**: User required

**Request Body**:

```typescript
{
  giftRuleId: string;
  productId: string;
}
```

**Response** (200 OK):

```typescript
{
  success: true;
  message: "Gift product added to cart";
  cartItem: CartItemWithProduct;
  cart: {
    items: CartItemWithProduct[];
    subtotal: number;
    total: number;
  };
}
```

**Errors**:

- 400: Invalid request / Conditions not met / Already has gift from this rule
- 404: Rule or product not found
- 409: Product out of stock

#### DELETE /api/cart/gift-product/:cartItemId

Elimină un produs cadou din coș.

**Authentication**: User required

**Response** (200 OK):

```typescript
{
  success: true;
  message: 'Gift product removed from cart';
}
```

#### POST /api/cart/reevaluate-gifts

Reevaluează cadourile după modificarea coșului.

**Authentication**: User required

**Response** (200 OK):

```typescript
{
  success: true;
  removedGifts: Array<{
    cartItemId: string;
    productName: string;
    reason: string;
  }>;
  eligibleRules: Array<...>; // Same as evaluate-gift-rules
}
```

### 6.3 Webhook/Internal Endpoints

#### POST /api/internal/gift-rules/invalidate-cache

Invalidează cache-ul de reguli (apelat intern la modificări).

**Authentication**: Internal only

**Response** (200 OK):

```typescript
{
  success: true;
  message: 'Cache invalidated';
}
```

## 7. Integration Points

### 7.1 Integrare cu Cart Service

**Modificări necesare în CartService**:

```typescript
class CartService {
  // Metodă nouă: Adaugă produs cadou
  async addGiftProduct(
    userId: string,
    giftRuleId: string,
    productId: string
  ): Promise<AddGiftToCartResponse> {
    // 1. Validează selecția
    const validation = await giftValidator.validateGiftSelection(
      userId,
      giftRuleId,
      productId,
      await this.getCartItems(userId)
    );

    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 2. Adaugă în coș cu isGift = true
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        dataItemId: productId,
        quantity: 1,
        isGift: true,
        giftRuleId,
      },
      include: {
        dataItem: true,
        giftRule: true,
      },
    });

    // 3. Returnează coșul actualizat
    return {
      success: true,
      message: 'Gift added to cart',
      cartItem,
      cart: await this.getCart(userId),
    };
  }

  // Metodă nouă: Reevaluează cadouri
  async reevaluateGifts(userId: string): Promise<ReevaluateResult> {
    const cartItems = await this.getCartItems(userId);
    const giftItems = cartItems.filter((item) => item.isGift);

    const removedGifts = [];

    // Verifică fiecare cadou dacă mai este valid
    for (const giftItem of giftItems) {
      if (!giftItem.giftRuleId) continue;

      const context = await this.buildEvaluationContext(userId);
      const result = await conditionEvaluator.evaluateRule(
        await giftRuleService.getRule(giftItem.giftRuleId),
        context
      );

      if (!result.isEligible) {
        // Elimină cadoul
        await prisma.cartItem.delete({ where: { id: giftItem.id } });
        removedGifts.push({
          cartItemId: giftItem.id,
          productName: giftItem.dataItem.title,
          reason: result.reason || 'Conditions no longer met',
        });
      }
    }

    // Obține reguli eligibile
    const eligibleRules = await this.getEligibleGifts(userId);

    return { removedGifts, eligibleRules };
  }

  // Hook în metodele existente
  async updateQuantity(userId: string, itemId: string, quantity: number) {
    // ... cod existent ...

    // După modificare, reevaluează cadourile
    await this.reevaluateGifts(userId);

    return updatedCart;
  }

  async removeItem(userId: string, itemId: string) {
    // ... cod existent ...

    // După eliminare, reevaluează cadourile
    await this.reevaluateGifts(userId);

    return updatedCart;
  }
}
```

### 7.2 Integrare cu Order Service

**Modificări necesare în OrderService**:

```typescript
class OrderService {
  async createOrder(
    userId: string,
    orderData: CreateOrderData
  ): Promise<Order> {
    // 1. Obține coșul cu cadouri
    const cartItems = await cartService.getCartItems(userId);

    // 2. Validează cadourile înainte de plasare
    const validation = await giftValidator.validateGiftsInOrder(
      userId,
      cartItems
    );
    if (!validation.isValid) {
      throw new Error(`Invalid gifts: ${validation.errors.join(', ')}`);
    }

    // 3. Creează comanda
    const order = await prisma.order.create({
      data: {
        userId,
        total: orderData.total,
        subtotal: orderData.subtotal,
        // ... alte câmpuri
      },
    });

    // 4. Creează OrderItems (inclusiv cadouri)
    for (const cartItem of cartItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          dataItemId: cartItem.dataItemId,
          quantity: cartItem.quantity,
          price: cartItem.isGift ? 0 : cartItem.dataItem.price,
          isGift: cartItem.isGift,
          giftRuleId: cartItem.giftRuleId,
          originalPrice: cartItem.dataItem.price,
        },
      });

      // 5. Dacă este cadou, înregistrează utilizarea
      if (cartItem.isGift && cartItem.giftRuleId) {
        await prisma.giftRuleUsage.create({
          data: {
            giftRuleId: cartItem.giftRuleId,
            userId,
            orderId: order.id,
            productId: cartItem.dataItemId,
          },
        });

        // Incrementează currentTotalUses
        await prisma.giftRule.update({
          where: { id: cartItem.giftRuleId },
          data: { currentTotalUses: { increment: 1 } },
        });
      }
    }

    // 6. Decrementează stoc (inclusiv pentru cadouri)
    await stockService.decrementStockForOrder(order.id);

    // 7. Golește coșul
    await cartService.clearCart(userId);

    return order;
  }
}
```

### 7.3 Integrare cu Stock Service

**Modificări necesare**:

```typescript
class StockService {
  async checkAvailability(
    productId: string,
    quantity: number
  ): Promise<boolean> {
    const product = await prisma.dataItem.findUnique({
      where: { id: productId },
    });

    if (!product) return false;

    // Verifică stocul disponibil (stoc total - stoc rezervat)
    const availableStock = product.stock - (product.reservedStock || 0);
    return availableStock >= quantity;
  }

  async decrementStockForOrder(orderId: string): Promise<void> {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
      include: { dataItem: true },
    });

    for (const item of orderItems) {
      // Decrementează stoc pentru toate produsele (inclusiv cadouri)
      await prisma.dataItem.update({
        where: { id: item.dataItemId },
        data: {
          stock: { decrement: item.quantity },
          totalSold: { increment: item.quantity },
        },
      });

      // Înregistrează mișcare stoc
      await prisma.stockMovement.create({
        data: {
          dataItemId: item.dataItemId,
          type: 'OUT',
          quantity: -item.quantity,
          reason: item.isGift ? 'GIFT_ORDER' : 'SALE',
          orderId,
        },
      });
    }
  }
}
```

### 7.4 Integrare cu Frontend Components

**Cart Component**:

```typescript
// Modificări în componenta Cart
const Cart = () => {
  const { cart, removeItem, updateQuantity } = useCart();
  const { eligibleRules, evaluateGifts } = useGiftSystem();

  useEffect(() => {
    // Reevaluează cadourile când coșul se modifică
    evaluateGifts();
  }, [cart.items]);

  return (
    <div>
      {/* Lista produse normale */}
      {cart.items.filter(item => !item.isGift).map(item => (
        <CartItem key={item.id} item={item} />
      ))}

      {/* Lista produse cadou */}
      {cart.items.filter(item => item.isGift).map(item => (
        <GiftCartItem key={item.id} item={item} />
      ))}

      {/* Secțiune cadouri disponibile */}
      {eligibleRules.length > 0 && (
        <GiftSelection rules={eligibleRules} />
      )}
    </div>
  );
};
```

**Checkout Component**:

```typescript
const Checkout = () => {
  const { cart } = useCart();
  const { eligibleRules, selectedGifts, selectGift } = useGiftSystem();

  return (
    <div>
      {/* Produse din coș */}
      <CartSummary items={cart.items} />

      {/* Secțiune cadouri */}
      {eligibleRules.length > 0 && (
        <div className="gift-section">
          <h3>🎁 Produse Cadou Disponibile</h3>
          {eligibleRules.map(({ rule, availableProducts }) => (
            <GiftRuleSection
              key={rule.id}
              rule={rule}
              products={availableProducts}
              selectedProductId={selectedGifts.get(rule.id)}
              onSelect={(productId) => selectGift(rule.id, productId)}
            />
          ))}
        </div>
      )}

      {/* Buton plasare comandă */}
      <PlaceOrderButton />
    </div>
  );
};
```

## 8. Error Handling

### 8.1 Error Types

```typescript
enum GiftSystemErrorCode {
  // Validation errors
  INVALID_RULE_DATA = 'INVALID_RULE_DATA',
  INVALID_CONDITION = 'INVALID_CONDITION',
  INVALID_PRODUCT = 'INVALID_PRODUCT',

  // Business logic errors
  CONDITIONS_NOT_MET = 'CONDITIONS_NOT_MET',
  RULE_NOT_ACTIVE = 'RULE_NOT_ACTIVE',
  RULE_EXPIRED = 'RULE_EXPIRED',
  USAGE_LIMIT_REACHED = 'USAGE_LIMIT_REACHED',
  GIFT_ALREADY_SELECTED = 'GIFT_ALREADY_SELECTED',

  // Stock errors
  PRODUCT_OUT_OF_STOCK = 'PRODUCT_OUT_OF_STOCK',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',

  // Not found errors
  RULE_NOT_FOUND = 'RULE_NOT_FOUND',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',

  // Permission errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
}

class GiftSystemError extends Error {
  constructor(
    public code: GiftSystemErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GiftSystemError';
  }
}
```

### 8.2 Error Handling Strategy

```typescript
// În API endpoints
app.post('/api/cart/add-gift-product', async (req, res) => {
  try {
    const result = await cartService.addGiftProduct(
      req.user.id,
      req.body.giftRuleId,
      req.body.productId
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof GiftSystemError) {
      const statusCode = getStatusCodeForError(error.code);
      return res.status(statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
    }

    // Eroare neașteptată
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
});

function getStatusCodeForError(code: GiftSystemErrorCode): number {
  switch (code) {
    case GiftSystemErrorCode.INVALID_RULE_DATA:
    case GiftSystemErrorCode.INVALID_CONDITION:
    case GiftSystemErrorCode.INVALID_PRODUCT:
    case GiftSystemErrorCode.CONDITIONS_NOT_MET:
    case GiftSystemErrorCode.GIFT_ALREADY_SELECTED:
      return 400;

    case GiftSystemErrorCode.UNAUTHORIZED:
      return 401;

    case GiftSystemErrorCode.FORBIDDEN:
      return 403;

    case GiftSystemErrorCode.RULE_NOT_FOUND:
    case GiftSystemErrorCode.PRODUCT_NOT_FOUND:
      return 404;

    case GiftSystemErrorCode.PRODUCT_OUT_OF_STOCK:
    case GiftSystemErrorCode.INSUFFICIENT_STOCK:
      return 409;

    default:
      return 500;
  }
}
```

### 8.3 User-Facing Error Messages

```typescript
const ERROR_MESSAGES: Record<GiftSystemErrorCode, string> = {
  [GiftSystemErrorCode.CONDITIONS_NOT_MET]:
    'Coșul tău nu îndeplinește condițiile pentru acest cadou.',

  [GiftSystemErrorCode.RULE_NOT_ACTIVE]:
    'Această ofertă de cadou nu mai este activă.',

  [GiftSystemErrorCode.RULE_EXPIRED]: 'Această ofertă de cadou a expirat.',

  [GiftSystemErrorCode.USAGE_LIMIT_REACHED]:
    'Ai atins limita de utilizări pentru această ofertă.',

  [GiftSystemErrorCode.GIFT_ALREADY_SELECTED]:
    'Ai selectat deja un cadou din această ofertă.',

  [GiftSystemErrorCode.PRODUCT_OUT_OF_STOCK]:
    'Produsul cadou selectat nu mai este în stoc.',

  [GiftSystemErrorCode.INSUFFICIENT_STOCK]:
    'Stoc insuficient pentru produsul cadou selectat.',

  [GiftSystemErrorCode.RULE_NOT_FOUND]: 'Oferta de cadou nu a fost găsită.',

  [GiftSystemErrorCode.PRODUCT_NOT_FOUND]: 'Produsul cadou nu a fost găsit.',

  // ... alte mesaje
};
```

### 8.4 Frontend Error Handling

```typescript
// În componenta React
const GiftSelection = ({ rule, products }) => {
  const [error, setError] = useState<string | null>(null);
  const { selectGift } = useGiftSystem();

  const handleSelectGift = async (productId: string) => {
    try {
      setError(null);
      await selectGift(rule.id, productId);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error.message);
      } else {
        setError('A apărut o eroare. Te rugăm să încerci din nou.');
      }
    }
  };

  return (
    <div>
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {/* ... rest of component */}
    </div>
  );
};
```

## 9. Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### 9.1 Rule Management Properties

Property 1: Rule Creation Persistence
_For any_ valid gift rule data, creating a rule should result in that rule being retrievable from the database with all its properties intact.
**Validates: Requirements 2.1.1**

Property 2: Rule Update Preservation
_For any_ existing gift rule and valid update data, updating the rule should preserve the rule's identity while changing only the specified fields.
**Validates: Requirements 2.1.2**

Property 3: Rule Deletion Completeness
_For any_ existing gift rule, deleting the rule should result in the rule no longer being retrievable and all associated data (conditions, gift products) being removed.
**Validates: Requirements 2.1.3**

Property 4: Rule Status Toggle Idempotence
_For any_ gift rule, toggling its active status twice should return it to its original state without affecting other properties.
**Validates: Requirements 2.1.4**

Property 5: Rule Name Requirement
_For any_ created or updated gift rule, the rule must have a non-empty name.
**Validates: Requirements 2.1.5**

Property 6: Rule Priority Bounds
_For any_ gift rule, the priority value must be between 1 and 100 inclusive.
**Validates: Requirements 2.1.6**

### 9.2 Condition Evaluation Properties

Property 7: Minimum Amount Condition Correctness
_For any_ cart with a MIN_AMOUNT condition, the condition should evaluate to true if and only if the subtotal of non-gift items meets or exceeds the minimum amount.
**Validates: Requirements 2.2.1**

Property 8: Specific Product Condition Correctness
_For any_ cart with a SPECIFIC_PRODUCT condition, the condition should evaluate to true if and only if the cart contains the specified product in at least the minimum quantity (excluding gift items).
**Validates: Requirements 2.2.2**

Property 9: Product Category Condition Correctness
_For any_ cart with a PRODUCT_CATEGORY condition, the condition should evaluate to true if and only if the cart contains at least one non-gift product from the specified category.
**Validates: Requirements 2.2.4**

Property 10: AND Logic Correctness
_For any_ rule with multiple conditions combined with AND logic, the rule should be eligible if and only if all conditions evaluate to true.
**Validates: Requirements 2.2.6, 2.2.7**

Property 11: OR Logic Correctness
_For any_ rule with multiple conditions combined with OR logic, the rule should be eligible if and only if at least one condition evaluates to true.
**Validates: Requirements 2.2.3, 2.2.5, 2.2.7**

Property 12: Minimum Quantity Enforcement
_For any_ product-based condition with a minimum quantity, the condition should only be met when the cart contains at least that quantity of the product.
**Validates: Requirements 2.2.8**

### 9.3 Gift Product Properties

Property 13: Gift Product Validity
_For any_ gift product associated with a rule, the product must reference a valid DataItem that exists in the inventory.
**Validates: Requirements 2.3.2**

Property 14: Gift Stock Validation
_For any_ gift product with zero stock, that product should not appear in the list of available gifts when evaluating eligible rules.
**Validates: Requirements 2.3.3, 2.6.1**

Property 15: Gift Product Data Inheritance
_For any_ gift product, the returned data should include the product's title, image, price, and stock from the original DataItem.
**Validates: Requirements 2.3.5**

### 9.4 Gift Selection Properties

Property 16: One Gift Per Rule Constraint
_For any_ user and gift rule, attempting to add a second gift product from the same rule should fail with an appropriate error.
**Validates: Requirements 2.4.3, 2.4.4, 2.8.1**

Property 17: Multiple Rules Multiple Gifts
_For any_ user with multiple eligible rules, the user should be able to select one gift product from each eligible rule.
**Validates: Requirements 2.4.5**

Property 18: Gift Price Zero
_For any_ gift product added to cart or order, the price should be 0 regardless of the original product price.
**Validates: Requirements 2.4.6, 2.7.1**

Property 19: Gift Flag Marking
_For any_ gift product in cart or order, the isGift flag should be true and giftRuleId should reference the rule that provided it.
**Validates: Requirements 2.4.7, 2.7.2**

### 9.5 Dynamic Validation Properties

Property 20: Condition Reevaluation on Cart Change
_For any_ cart modification (add, remove, update quantity), the system should reevaluate all gift rules and update eligible rules accordingly.
**Validates: Requirements 2.5.1**

Property 21: Automatic Gift Removal
_For any_ gift in cart, if the conditions for its rule are no longer met after a cart modification, the gift should be automatically removed from the cart.
**Validates: Requirements 2.5.2, 2.5.3**

Property 22: New Rule Eligibility Detection
_For any_ cart modification that causes a previously ineligible rule to become eligible, that rule should appear in the list of eligible rules.
**Validates: Requirements 2.5.4**

### 9.6 Stock Management Properties

Property 23: Gift Stock Validation on Selection
_For any_ attempt to add a gift product to cart, if the product has zero stock at the time of addition, the operation should fail with a stock error.
**Validates: Requirements 2.6.3**

Property 24: Gift Stock Decrement on Order
_For any_ order containing gift products, placing the order should decrement the stock of each gift product by the ordered quantity.
**Validates: Requirements 2.6.4, 2.7.3**

### 9.7 Business Rule Properties

Property 25: Gift Exclusion from Conditions
_For any_ condition evaluation, gift items in the cart should be excluded from subtotal calculations and product/category checks.
**Validates: Requirements 2.8.3**

Property 26: Same Product as Regular and Gift
_For any_ product, a user should be able to have the same product in their cart both as a regular purchase and as a gift (two separate cart items).
**Validates: Requirements 2.8.4**

Property 27: Gift Statistics Separation
_For any_ reporting query, gift products should be counted and reported separately from regular sales, with the original price tracked for cost analysis.
**Validates: Requirements 2.7.5**

### 9.8 Temporal and Limit Properties

Property 28: Rule Temporal Validity
_For any_ gift rule with validFrom and validUntil dates, the rule should only be eligible for evaluation if the current time is within the validity period.
**Validates: Requirements (implicit from design)**

Property 29: User Usage Limit Enforcement
_For any_ user and gift rule with maxUsesPerCustomer, the user should not be able to use the rule more than the specified number of times.
**Validates: Requirements (implicit from design)**

Property 30: Total Usage Limit Enforcement
_For any_ gift rule with maxTotalUses, the rule should become ineligible once the total usage count reaches the limit.
**Validates: Requirements (implicit from design)**

### 9.9 Priority and Conflict Resolution Properties

Property 31: Rule Priority Ordering
_For any_ set of eligible rules, when multiple rules offer the same gift product, the rule with higher priority should take precedence.
**Validates: Requirements (implicit from design)**

## 10. Testing Strategy

### 10.1 Testing Approach

The gift products system requires a dual testing approach combining unit tests and property-based tests:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property-based tests**: Verify universal properties across all inputs using randomized test data

Both approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property-based tests verify general correctness across a wide range of inputs.

### 10.2 Property-Based Testing Configuration

**Library Selection**:

- For TypeScript/JavaScript: Use `fast-check` library
- Each property test must run minimum 100 iterations due to randomization
- Each test must be tagged with a comment referencing the design property

**Tag Format**:

```typescript
// Feature: gift-products-system, Property 1: Rule Creation Persistence
test('rule creation persistence property', async () => {
  await fc.assert(
    fc.asyncProperty(arbitraryGiftRuleData(), async (ruleData) => {
      const created = await giftRuleService.createRule(ruleData, 'admin_id');
      const retrieved = await giftRuleService.getRule(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.name).toBe(ruleData.name);
      expect(retrieved.priority).toBe(ruleData.priority);
      // ... verify all properties
    }),
    { numRuns: 100 }
  );
});
```

### 10.3 Test Organization

```
backend/src/
  __tests__/
    gift-system/
      unit/
        gift-rule-service.test.ts
        condition-evaluator.test.ts
        gift-validator.test.ts
        cart-service-extensions.test.ts
      property/
        rule-management.property.test.ts
        condition-evaluation.property.test.ts
        gift-selection.property.test.ts
        stock-management.property.test.ts
      integration/
        gift-system-flow.integration.test.ts
        cart-gift-integration.test.ts
        order-gift-integration.test.ts
      arbitraries/
        gift-rule.arbitrary.ts
        condition.arbitrary.ts
        cart.arbitrary.ts
```

### 10.4 Key Test Scenarios

**Unit Tests Focus**:

- Specific condition combinations (e.g., "amount >= 200 AND product X")
- Edge cases (zero stock, expired rules, usage limits)
- Error conditions (invalid data, unauthorized access)
- Integration points (cart updates, order creation)

**Property Tests Focus**:

- Rule CRUD operations maintain data integrity
- Condition evaluation correctness across all condition types
- Gift selection constraints (one per rule, multiple rules)
- Stock validation and decrement
- Automatic gift removal on condition failure
- Gift exclusion from condition calculations

### 10.5 Test Data Generators (Arbitraries)

```typescript
// Exemplu de arbitrary pentru fast-check
import * as fc from 'fast-check';

export const arbitraryGiftRuleData = () =>
  fc.record({
    name: fc.string({ minLength: 1, maxLength: 200 }),
    description: fc.option(fc.string({ maxLength: 1000 })),
    priority: fc.integer({ min: 1, max: 100 }),
    conditionLogic: fc.constantFrom('AND', 'OR'),
    conditions: fc.array(arbitraryCondition(), { minLength: 1, maxLength: 5 }),
    giftProductIds: fc.array(fc.uuid(), { minLength: 1, maxLength: 10 }),
    maxUsesPerCustomer: fc.option(fc.integer({ min: 1, max: 100 })),
    maxTotalUses: fc.option(fc.integer({ min: 1, max: 10000 })),
    validFrom: fc.option(fc.date()),
    validUntil: fc.option(fc.date()),
  });

export const arbitraryCondition = () =>
  fc.oneof(
    // MIN_AMOUNT condition
    fc.record({
      type: fc.constant('MIN_AMOUNT'),
      minAmount: fc.float({ min: 1, max: 10000 }),
    }),

    // SPECIFIC_PRODUCT condition
    fc.record({
      type: fc.constant('SPECIFIC_PRODUCT'),
      productId: fc.uuid(),
      minQuantity: fc.integer({ min: 1, max: 10 }),
    }),

    // PRODUCT_CATEGORY condition
    fc.record({
      type: fc.constant('PRODUCT_CATEGORY'),
      categoryId: fc.uuid(),
      minCategoryAmount: fc.option(fc.float({ min: 1, max: 5000 })),
    })
  );

export const arbitraryCart = () =>
  fc.record({
    userId: fc.uuid(),
    items: fc.array(arbitraryCartItem(), { minLength: 0, maxLength: 20 }),
  });

export const arbitraryCartItem = () =>
  fc.record({
    id: fc.uuid(),
    productId: fc.uuid(),
    quantity: fc.integer({ min: 1, max: 10 }),
    isGift: fc.boolean(),
    product: fc.record({
      id: fc.uuid(),
      title: fc.string({ minLength: 1, maxLength: 100 }),
      price: fc.float({ min: 1, max: 1000 }),
      categoryId: fc.uuid(),
      stock: fc.integer({ min: 0, max: 1000 }),
    }),
  });
```

### 10.6 Performance Testing

- Condition evaluation should complete in < 200ms for complex rules
- Cart reevaluation should complete in < 300ms
- Stock validation should complete in < 100ms
- Load testing: 100 concurrent users evaluating gift rules

### 10.7 Integration Testing

- End-to-end flow: Create rule → Add products to cart → Evaluate → Select gift → Place order
- Cart modification triggers reevaluation
- Order creation with gifts decrements stock correctly
- Multiple users using same gift rule concurrently

## 11. Security Considerations

### 11.1 Authentication and Authorization

```typescript
// Middleware pentru verificare admin
const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    });
  }
  next();
};

// Aplicare pe rutele admin
app.post('/api/admin/gift-rules', requireAdmin, createGiftRule);
app.put('/api/admin/gift-rules/:id', requireAdmin, updateGiftRule);
app.delete('/api/admin/gift-rules/:id', requireAdmin, deleteGiftRule);
```

### 11.2 Input Validation

```typescript
// Validare cu Zod
import { z } from 'zod';

const GiftRuleSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: z.number().int().min(1).max(100),
  conditionLogic: z.enum(['AND', 'OR']),
  conditions: z.array(ConditionSchema).min(1),
  giftProductIds: z.array(z.string().uuid()).min(1),
  maxUsesPerCustomer: z.number().int().positive().optional(),
  maxTotalUses: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
});

const ConditionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('MIN_AMOUNT'),
    minAmount: z.number().positive(),
  }),
  z.object({
    type: z.literal('SPECIFIC_PRODUCT'),
    productId: z.string().uuid(),
    minQuantity: z.number().int().positive().optional(),
  }),
  z.object({
    type: z.literal('PRODUCT_CATEGORY'),
    categoryId: z.string().uuid(),
    minCategoryAmount: z.number().positive().optional(),
  }),
]);
```

### 11.3 Backend Validation

**Critical**: Toate validările trebuie făcute pe backend, nu doar pe frontend.

```typescript
async function validateGiftSelection(
  userId: string,
  giftRuleId: string,
  productId: string
): Promise<void> {
  // 1. Verifică că regula există și este activă
  const rule = await prisma.giftRule.findUnique({
    where: { id: giftRuleId },
    include: { conditions: true, giftProducts: true },
  });

  if (!rule || !rule.isActive) {
    throw new GiftSystemError(
      GiftSystemErrorCode.RULE_NOT_ACTIVE,
      'Gift rule is not active'
    );
  }

  // 2. Verifică că produsul face parte din cadourile regulii
  const giftProduct = rule.giftProducts.find(
    (gp) => gp.productId === productId
  );
  if (!giftProduct) {
    throw new GiftSystemError(
      GiftSystemErrorCode.INVALID_PRODUCT,
      'Product is not a valid gift for this rule'
    );
  }

  // 3. Verifică stocul
  const product = await prisma.dataItem.findUnique({
    where: { id: productId },
  });

  if (!product || product.stock <= 0) {
    throw new GiftSystemError(
      GiftSystemErrorCode.PRODUCT_OUT_OF_STOCK,
      'Gift product is out of stock'
    );
  }

  // 4. Verifică că utilizatorul nu are deja un cadou din această regulă
  const existingGift = await prisma.cartItem.findFirst({
    where: {
      userId,
      isGift: true,
      giftRuleId,
    },
  });

  if (existingGift) {
    throw new GiftSystemError(
      GiftSystemErrorCode.GIFT_ALREADY_SELECTED,
      'You already have a gift from this rule'
    );
  }

  // 5. Reevaluează condițiile (pentru a preveni manipularea)
  const cart = await getCartItems(userId);
  const context = buildEvaluationContext(cart, userId);
  const result = await evaluateRule(rule, context);

  if (!result.isEligible) {
    throw new GiftSystemError(
      GiftSystemErrorCode.CONDITIONS_NOT_MET,
      'Conditions for this gift are not met'
    );
  }
}
```

### 11.4 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Rate limiting pentru evaluare cadouri (previne abuse)
const giftEvaluationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minut
  max: 30, // 30 requests per minut
  message: 'Too many gift evaluation requests, please try again later',
});

app.post(
  '/api/cart/evaluate-gift-rules',
  giftEvaluationLimiter,
  evaluateGiftRules
);
```

### 11.5 SQL Injection Prevention

Prisma ORM previne automat SQL injection prin parametrizare. Exemplu:

```typescript
// SIGUR - Prisma parametrizează automat
const rule = await prisma.giftRule.findUnique({
  where: { id: ruleId },
});

// NU FACE NICIODATĂ așa (raw SQL fără parametrizare)
// const rule = await prisma.$queryRaw`SELECT * FROM GiftRule WHERE id = ${ruleId}`;
```

## 12. Performance Optimizations

### 12.1 Database Indexing

Indexurile definite în schema Prisma asigură performanță:

```prisma
model GiftRule {
  // ...
  @@index([isActive])
  @@index([priority])
  @@index([validFrom])
  @@index([validUntil])
}

model GiftCondition {
  // ...
  @@index([giftRuleId])
  @@index([type])
  @@index([productId])
  @@index([categoryId])
}

model CartItem {
  // ...
  @@index([isGift])
  @@index([giftRuleId])
}
```

### 12.2 Query Optimization

```typescript
// Folosește include pentru a reduce numărul de query-uri
const rules = await prisma.giftRule.findMany({
  where: { isActive: true },
  include: {
    conditions: {
      include: {
        product: { select: { id: true, title: true, stock: true } },
        category: { select: { id: true, name: true } },
      },
    },
    giftProducts: {
      include: {
        product: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
            stock: true,
          },
        },
      },
    },
  },
  orderBy: { priority: 'desc' },
});
```

### 12.3 Caching Strategy

```typescript
import NodeCache from 'node-cache';

const rulesCache = new NodeCache({ stdTTL: 60 }); // 60 secunde

async function getActiveRulesWithCache(): Promise<GiftRuleData[]> {
  const cacheKey = 'active_rules';

  // Încearcă din cache
  const cached = rulesCache.get<GiftRuleData[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch din database
  const rules = await fetchActiveRules();

  // Salvează în cache
  rulesCache.set(cacheKey, rules);

  return rules;
}

// Invalidare cache la modificare
async function updateRule(id: string, data: any): Promise<GiftRuleData> {
  const updated = await prisma.giftRule.update({
    where: { id },
    data,
  });

  // Invalidează cache
  rulesCache.del('active_rules');

  return updated;
}
```

### 12.4 Batch Operations

```typescript
// Pentru verificare stoc pentru multiple produse
async function checkStockForMultipleProducts(
  productIds: string[]
): Promise<Map<string, number>> {
  const products = await prisma.dataItem.findMany({
    where: { id: { in: productIds } },
    select: { id: true, stock: true },
  });

  return new Map(products.map((p) => [p.id, p.stock]));
}
```

### 12.5 Lazy Loading

```typescript
// În frontend, încarcă produsele cadou doar când secțiunea este vizibilă
const GiftSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    if (isVisible && gifts.length === 0) {
      loadEligibleGifts();
    }
  }, [isVisible]);

  return (
    <IntersectionObserver onChange={setIsVisible}>
      {isVisible && <GiftProducts gifts={gifts} />}
    </IntersectionObserver>
  );
};
```

## 13. Monitoring and Logging

### 13.1 Logging Strategy

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'gift-system.log' }),
  ],
});

// Log evaluare reguli
logger.info('Gift rules evaluated', {
  userId,
  cartTotal: context.subtotal,
  eligibleRules: results.filter((r) => r.isEligible).length,
  timestamp: new Date().toISOString(),
});

// Log erori
logger.error('Gift selection failed', {
  userId,
  giftRuleId,
  productId,
  error: error.message,
  stack: error.stack,
});
```

### 13.2 Metrics

```typescript
// Folosește un sistem de metrics (ex: Prometheus)
import { Counter, Histogram } from 'prom-client';

const giftEvaluationCounter = new Counter({
  name: 'gift_evaluations_total',
  help: 'Total number of gift rule evaluations',
});

const giftSelectionCounter = new Counter({
  name: 'gift_selections_total',
  help: 'Total number of gift selections',
  labelNames: ['rule_id', 'product_id'],
});

const evaluationDuration = new Histogram({
  name: 'gift_evaluation_duration_seconds',
  help: 'Duration of gift rule evaluation',
  buckets: [0.1, 0.2, 0.5, 1, 2],
});

// Utilizare
async function evaluateGiftRules(context: EvaluationContext) {
  const timer = evaluationDuration.startTimer();
  giftEvaluationCounter.inc();

  try {
    const results = await performEvaluation(context);
    return results;
  } finally {
    timer();
  }
}
```

### 13.3 Health Checks

```typescript
app.get('/api/health/gift-system', async (req, res) => {
  try {
    // Verifică conexiunea la database
    await prisma.$queryRaw`SELECT 1`;

    // Verifică cache
    const cacheWorking = rulesCache.get('test') !== undefined || true;

    // Verifică că există reguli active
    const activeRulesCount = await prisma.giftRule.count({
      where: { isActive: true },
    });

    res.json({
      status: 'healthy',
      database: 'connected',
      cache: cacheWorking ? 'working' : 'degraded',
      activeRules: activeRulesCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});
```

## 14. Migration Strategy

### 14.1 Database Migration

```prisma
// migration.sql
-- Create GiftRule table
CREATE TABLE "GiftRule" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 50,
  "conditionLogic" TEXT NOT NULL DEFAULT 'AND',
  "maxUsesPerCustomer" INTEGER,
  "maxTotalUses" INTEGER,
  "currentTotalUses" INTEGER NOT NULL DEFAULT 0,
  "validFrom" TIMESTAMP,
  "validUntil" TIMESTAMP,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX "GiftRule_isActive_idx" ON "GiftRule"("isActive");
CREATE INDEX "GiftRule_priority_idx" ON "GiftRule"("priority");
CREATE INDEX "GiftRule_validFrom_idx" ON "GiftRule"("validFrom");
CREATE INDEX "GiftRule_validUntil_idx" ON "GiftRule"("validUntil");

-- Create GiftCondition table
CREATE TABLE "GiftCondition" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "giftRuleId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "minAmount" DOUBLE PRECISION,
  "productId" TEXT,
  "minQuantity" INTEGER DEFAULT 1,
  "categoryId" TEXT,
  "minCategoryAmount" DOUBLE PRECISION,
  "parentConditionId" TEXT,
  "logic" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("giftRuleId") REFERENCES "GiftRule"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "DataItem"("id") ON DELETE CASCADE,
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE,
  FOREIGN KEY ("parentConditionId") REFERENCES "GiftCondition"("id") ON DELETE CASCADE
);

-- Create indexes for GiftCondition
CREATE INDEX "GiftCondition_giftRuleId_idx" ON "GiftCondition"("giftRuleId");
CREATE INDEX "GiftCondition_type_idx" ON "GiftCondition"("type");
CREATE INDEX "GiftCondition_productId_idx" ON "GiftCondition"("productId");
CREATE INDEX "GiftCondition_categoryId_idx" ON "GiftCondition"("categoryId");

-- Create GiftProduct table
CREATE TABLE "GiftProduct" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "giftRuleId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "maxQuantityPerOrder" INTEGER NOT NULL DEFAULT 1,
  "remainingStock" INTEGER,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  FOREIGN KEY ("giftRuleId") REFERENCES "GiftRule"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "DataItem"("id") ON DELETE CASCADE,
  UNIQUE("giftRuleId", "productId")
);

-- Create indexes for GiftProduct
CREATE INDEX "GiftProduct_giftRuleId_idx" ON "GiftProduct"("giftRuleId");
CREATE INDEX "GiftProduct_productId_idx" ON "GiftProduct"("productId");

-- Create GiftRuleUsage table
CREATE TABLE "GiftRuleUsage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "giftRuleId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "usedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("giftRuleId") REFERENCES "GiftRule"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "DataItem"("id") ON DELETE CASCADE
);

-- Create indexes for GiftRuleUsage
CREATE INDEX "GiftRuleUsage_giftRuleId_idx" ON "GiftRuleUsage"("giftRuleId");
CREATE INDEX "GiftRuleUsage_userId_idx" ON "GiftRuleUsage"("userId");
CREATE INDEX "GiftRuleUsage_orderId_idx" ON "GiftRuleUsage"("orderId");
CREATE INDEX "GiftRuleUsage_usedAt_idx" ON "GiftRuleUsage"("usedAt");

-- Extend OrderItem table
ALTER TABLE "OrderItem" ADD COLUMN "isGift" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "OrderItem" ADD COLUMN "giftRuleId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "originalPrice" DOUBLE PRECISION;
ALTER TABLE "OrderItem" ADD FOREIGN KEY ("giftRuleId") REFERENCES "GiftRule"("id") ON DELETE SET NULL;
CREATE INDEX "OrderItem_isGift_idx" ON "OrderItem"("isGift");
CREATE INDEX "OrderItem_giftRuleId_idx" ON "OrderItem"("giftRuleId");

-- Extend CartItem table
ALTER TABLE "CartItem" ADD COLUMN "isGift" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CartItem" ADD COLUMN "giftRuleId" TEXT;
ALTER TABLE "CartItem" ADD FOREIGN KEY ("giftRuleId") REFERENCES "GiftRule"("id") ON DELETE SET NULL;
CREATE INDEX "CartItem_isGift_idx" ON "CartItem"("isGift");
CREATE INDEX "CartItem_giftRuleId_idx" ON "CartItem"("giftRuleId");
```

### 14.2 Rollback Plan

```sql
-- Rollback script
ALTER TABLE "CartItem" DROP COLUMN "giftRuleId";
ALTER TABLE "CartItem" DROP COLUMN "isGift";

ALTER TABLE "OrderItem" DROP COLUMN "originalPrice";
ALTER TABLE "OrderItem" DROP COLUMN "giftRuleId";
ALTER TABLE "OrderItem" DROP COLUMN "isGift";

DROP TABLE "GiftRuleUsage";
DROP TABLE "GiftProduct";
DROP TABLE "GiftCondition";
DROP TABLE "GiftRule";
```

### 14.3 Deployment Steps

1. **Backup database**
2. **Run migrations** (create new tables and extend existing ones)
3. **Deploy backend code** (new services and API endpoints)
4. **Deploy frontend code** (new components)
5. **Verify health checks**
6. **Monitor logs and metrics**
7. **Create initial test rules** (for validation)

## 15. Future Enhancements

### 15.1 Planned Features (P1)

- **Notificări push**: Alertează utilizatorii când devin eligibili pentru cadouri
- **Recomandări inteligente**: "Mai adaugă X RON pentru a primi cadou"
- **A/B testing**: Testează diferite reguli pentru a optimiza conversiile
- **Istoric cadouri**: Pagină unde utilizatorii văd cadourile primite

### 15.2 Nice to Have (P2)

- **Cadouri pe categorii de utilizatori**: Reguli diferite pentru utilizatori noi vs. fideli
- **Cadouri sezoniere**: Activare automată în anumite perioade
- **Gamification**: Puncte sau badge-uri pentru cadouri primite
- **Export rapoarte**: Rapoarte detaliate despre cadourile oferite

### 15.3 Technical Debt

- Implementare Redis pentru caching distribuit (în loc de NodeCache)
- Implementare queue system (Bull/BullMQ) pentru procesare asincronă
- Implementare event sourcing pentru audit trail complet
- Optimizare evaluare condiții cu algoritmi mai eficienți

## 16. Appendix

### 16.1 Glossary

- **Gift Rule**: Regulă care definește condițiile și produsele cadou
- **Condition**: Criteriu care trebuie îndeplinit (sumă, produs, categorie)
- **Gift Product**: Produs oferit gratuit când condițiile sunt îndeplinite
- **Evaluation Context**: Datele necesare pentru evaluarea condițiilor (coș, utilizator)
- **Eligible Rule**: Regulă ale cărei condiții sunt îndeplinite

### 16.2 References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [fast-check Documentation](https://github.com/dubzzz/fast-check)
- [Property-Based Testing Guide](https://fsharpforfunandprofit.com/posts/property-based-testing/)

### 16.3 Decision Log

**Decision 1**: Folosim Prisma pentru ORM

- **Rationale**: Type-safety, migrații automate, query builder intuitiv
- **Alternatives**: TypeORM, Sequelize
- **Date**: Design phase

**Decision 2**: Condiții imbricate cu maxim 3 nivele

- **Rationale**: Balanță între flexibilitate și complexitate
- **Alternatives**: Unlimited nesting, no nesting
- **Date**: Design phase

**Decision 3**: Cache în memorie cu NodeCache

- **Rationale**: Simplu pentru MVP, poate fi înlocuit cu Redis mai târziu
- **Alternatives**: Redis, Memcached
- **Date**: Design phase

**Decision 4**: Property-based testing cu fast-check

- **Rationale**: Cel mai popular și bine întreținut pentru TypeScript
- **Alternatives**: jsverify, testcheck-js
- **Date**: Design phase
