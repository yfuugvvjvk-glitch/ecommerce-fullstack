**4.1.4. Optimizarea performanței frontend**

Performanța frontend-ului a fost optimizată prin mai multe tehnici:

```typescript
// Lazy loading pentru componente mari
const AdminPanel = lazy(() => import('../components/AdminPanel'));
const ProductDetails = lazy(() => import('../components/ProductDetails'));

// Memoizarea componentelor pentru evitarea re-render-urilor inutile
const ProductList = memo(({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
});

// Virtualizarea pentru liste mari
import { FixedSizeList as List } from 'react-window';

const VirtualizedProductList = ({ products }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  );

  return (
    <List height={600} itemCount={products.length} itemSize={300} width="100%">
      {Row}
    </List>
  );
};
```

**4.1.5. Gestionarea erorilor și loading states**

```typescript
// Error Boundary pentru capturarea erorilor
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Aici se poate integra cu un serviciu de logging
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Ceva nu a mers bine
            </h2>
            <p className="text-gray-600 mb-6">
              Ne pare rău, dar a apărut o eroare neașteptată.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reîncarcă pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pentru gestionarea stărilor de loading
const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (operation: () => Promise<any>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'O eroare neașteptată');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};
```

### 4.2. Dezvoltarea backend-ului

Backend-ul a fost dezvoltat folosind Fastify cu o arhitectură modulară și scalabilă.

**4.2.1. Structura API-ului REST**

```typescript
// Definirea rutelor principale
export async function setupRoutes(fastify: FastifyInstance) {
  // Autentificare
  await fastify.register(authRoutes, { prefix: '/api/auth' });

  // Produse
  await fastify.register(productRoutes, { prefix: '/api/products' });

  // Coș de cumpărături
  await fastify.register(cartRoutes, { prefix: '/api/cart' });

  // Comenzi
  await fastify.register(orderRoutes, { prefix: '/api/orders' });

  // Administrare
  await fastify.register(adminRoutes, { prefix: '/api/admin' });
}

// Exemplu de rută pentru produse
export async function productRoutes(fastify: FastifyInstance) {
  // GET /api/products - Lista produselor
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', default: 1 },
            limit: { type: 'number', default: 20 },
            category: { type: 'string' },
            search: { type: 'string' },
            sortBy: { type: 'string', enum: ['price', 'name', 'date'] },
            sortOrder: { type: 'string', enum: ['asc', 'desc'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: { $ref: 'Product#' },
              },
              pagination: { $ref: 'Pagination#' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { page, limit, category, search, sortBy, sortOrder } =
        request.query as any;

      try {
        const result = await productService.getProducts({
          page,
          limit,
          category,
          search,
          sortBy,
          sortOrder,
        });

        reply.send(result);
      } catch (error) {
        reply.code(500).send({ error: 'Failed to fetch products' });
      }
    }
  );

  // POST /api/products - Creare produs nou (doar admin)
  fastify.post(
    '/',
    {
      preHandler: [authMiddleware, adminMiddleware],
      schema: {
        body: { $ref: 'CreateProduct#' },
        response: {
          201: { $ref: 'Product#' },
        },
      },
    },
    async (request, reply) => {
      try {
        const product = await productService.createProduct(request.body as any);
        reply.code(201).send(product);
      } catch (error) {
        reply.code(400).send({ error: error.message });
      }
    }
  );
}
```

**4.2.2. Serviciile de business logic**

```typescript
// Product Service
export class ProductService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getProducts(params: GetProductsParams) {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
    const skip = (page - 1) * limit;

    // Construirea query-ului de filtrare
    const where: any = {
      status: 'published',
    };

    if (category) {
      where.category = {
        name: { equals: category, mode: 'insensitive' },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Construirea query-ului de sortare
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calcularea rating-ului mediu pentru fiecare produs
    const productsWithRating = products.map((product) => ({
      ...product,
      averageRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    }));

    return {
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createProduct(data: CreateProductData) {
    // Validarea datelor
    if (!data.title || !data.price || !data.categoryId) {
      throw new Error('Missing required fields');
    }

    if (data.price <= 0) {
      throw new Error('Price must be positive');
    }

    // Verificarea existenței categoriei
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Crearea produsului
    const product = await this.prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock || 0,
        categoryId: data.categoryId,
        image: data.image,
        status: 'published',
      },
      include: {
        category: true,
      },
    });

    return product;
  }

  async updateStock(productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    return await this.prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}
```

**4.2.3. Middleware-uri pentru autentificare și autorizare**

```typescript
// Auth Middleware
export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = request.server.jwt.verify(token) as JWTPayload;

      // Verificarea existenței utilizatorului
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (!user) {
        return reply.code(401).send({ error: 'User not found' });
      }

      // Adăugarea utilizatorului la request
      request.user = user;
    } catch (jwtError) {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  } catch (error) {
    return reply.code(500).send({ error: 'Authentication error' });
  }
};

// Admin Middleware
export const adminMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.code(401).send({ error: 'Authentication required' });
  }

  if (request.user.role !== 'admin') {
    return reply.code(403).send({ error: 'Admin access required' });
  }
};

// Rate Limiting Middleware
export const rateLimitMiddleware = {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: (request: FastifyRequest, context: any) => {
    return {
      error: 'Rate limit exceeded',
      message: `Too many requests, please try again later.`,
      expiresIn: Math.round(context.ttl / 1000),
    };
  },
};
```

**4.2.4. Gestionarea erorilor**

```typescript
// Error Handler Global
export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Logging-ul erorii
  request.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  // Gestionarea diferitelor tipuri de erori
  if (error.name === 'ValidationError') {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.details || [],
    });
  }

  if (error.name === 'UnauthorizedError') {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (error.name === 'ForbiddenError') {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'Insufficient permissions',
    });
  }

  if (error.name === 'NotFoundError') {
    return reply.code(404).send({
      error: 'Not Found',
      message: error.message || 'Resource not found',
    });
  }

  // Erori de bază de date
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;

    if (prismaError.code === 'P2002') {
      return reply.code(409).send({
        error: 'Conflict',
        message: 'Resource already exists',
      });
    }

    if (prismaError.code === 'P2025') {
      return reply.code(404).send({
        error: 'Not Found',
        message: 'Resource not found',
      });
    }
  }

  // Eroare generică pentru producție
  const isDevelopment = process.env.NODE_ENV === 'development';

  reply.code(500).send({
    error: 'Internal Server Error',
    message: isDevelopment ? error.message : 'An unexpected error occurred',
    ...(isDevelopment && { stack: error.stack }),
  });
};
```

### 4.3. Integrarea bazei de date

Integrarea cu baza de date PostgreSQL a fost realizată folosind Prisma ORM pentru type safety și performanță optimă.

**4.3.1. Schema bazei de date**

```prisma
// Schema Prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  phone     String?
  address   String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relații
  orders    Order[]
  cartItems CartItem[]
  reviews   Review[]
  favorites Favorite[]

  @@map("users")
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  image       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relații
  products Product[]

  @@map("categories")
}

model Product {
  id          String   @id @default(cuid())
  title       String
  description String?
  price       Float
  oldPrice    Float?
  stock       Int      @default(0)
  image       String
  status      Status   @default(DRAFT)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relații
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  orderItems OrderItem[]
  cartItems  CartItem[]
  reviews    Review[]
  favorites  Favorite[]

  @@map("products")
}

model Order {
  id              String      @id @default(cuid())
  total           Float
  status          OrderStatus @default(PROCESSING)
  shippingAddress String
  paymentMethod   String      @default("cash")
  deliveryMethod  String      @default("courier")
  orderLocalTime  String?
  orderLocation   String?
  orderTimezone   String?
  invoiceNumber   String?     @unique
  invoiceGenerated Boolean    @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relații
  userId String
  user   User   @relation(fields: [userId], references: [id])

  orderItems OrderItem[]

  @@map("orders")
}

model OrderItem {
  id       String @id @default(cuid())
  quantity Int
  price    Float

  // Relații
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model CartItem {
  id       String @id @default(cuid())
  quantity Int    @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relații
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
  @@map("cart_items")
}

enum Role {
  USER
  ADMIN
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum OrderStatus {
  PROCESSING
  PREPARING
  SHIPPING
  DELIVERED
  CANCELLED
}
```

**4.3.2. Migrații și seeding**

```typescript
// Seed script pentru date inițiale
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Creare categorii
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronice',
        slug: 'electronice',
        description: 'Produse electronice și gadget-uri',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Îmbrăcăminte',
        slug: 'imbracaminte',
        description: 'Haine și accesorii',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cărți',
        slug: 'carti',
        description: 'Cărți și materiale educaționale',
      },
    }),
  ]);

  // Creare utilizator admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  // Creare produse sample
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'Laptop Gaming ASUS ROG',
        description: 'Laptop performant pentru gaming și productivitate',
        price: 4999.99,
        oldPrice: 5499.99,
        stock: 15,
        image: '/images/laptop-asus.jpg',
        status: 'PUBLISHED',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Tricou Casual Premium',
        description: 'Tricou din bumbac 100% organic',
        price: 89.99,
        stock: 50,
        image: '/images/tricou-casual.jpg',
        status: 'PUBLISHED',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'JavaScript: The Good Parts',
        description: 'Carte esențială pentru dezvoltatorii JavaScript',
        price: 45.99,
        stock: 25,
        image: '/images/js-book.jpg',
        status: 'PUBLISHED',
        categoryId: categories[2].id,
      },
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${products.length} products`);
  console.log(`Created admin user: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

_[Continuarea în următorul fișier...]_
