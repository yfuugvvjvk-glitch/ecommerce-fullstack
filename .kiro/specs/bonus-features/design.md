# Design Document - Bonus Features

## Overview

Acest document descrie design-ul tehnic pentru implementarea celor 4 funcționalități bonus: OpenAI API Integration, Real-time Analytics, Internationalization (i18n), și WebSocket Notifications.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  i18n Provider │  │ WebSocket Hook │  │ AI Chatbot   │  │
│  │  (next-intl)   │  │  (Socket.io)   │  │  Component   │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │ Analytics Hook │  │  Notification  │                     │
│  │  (tracking)    │  │    Center      │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Fastify)                         │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ OpenAI Service │  │ Analytics API  │  │  WebSocket   │  │
│  │                │  │                │  │   Server     │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │ Notification   │  │  Translation   │                     │
│  │   Service      │  │    Service     │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │  OpenAI API    │  │   PostgreSQL   │                     │
│  │  (GPT-4)       │  │   (Analytics)  │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. OpenAI API Integration

#### Backend Components

**OpenAI Service (`backend/src/services/openai.service.ts`)**

```typescript
interface OpenAIService {
  generateProductRecommendations(
    productId: string,
    userId?: string
  ): Promise<Product[]>;
  generateProductDescription(title: string, category: string): Promise<string>;
  chatCompletion(messages: ChatMessage[]): Promise<string>;
  moderateContent(text: string): Promise<ModerationResult>;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

**OpenAI Routes (`backend/src/routes/openai.routes.ts`)**

- `POST /api/ai/recommendations` - Get product recommendations
- `POST /api/ai/generate-description` - Generate product description (admin)
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/moderate` - Moderate user content

#### Frontend Components

**AI Chatbot Component (`frontend/components/AIChatbot.tsx`)**

- Floating chat button
- Chat interface with message history
- Typing indicator
- Error handling

**Product Recommendations (`frontend/components/AIRecommendations.tsx`)**

- Display AI-generated recommendations
- Loading skeleton
- Fallback to manual recommendations

### 2. Real-time Analytics

#### Backend Components

**Analytics Service (`backend/src/services/analytics.service.ts`)**

```typescript
interface AnalyticsService {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  getRealtimeStats(): Promise<RealtimeStats>;
  getEventsByTimeRange(start: Date, end: Date): Promise<AnalyticsEvent[]>;
  aggregateMetrics(
    period: 'hour' | 'day' | 'month'
  ): Promise<AggregatedMetrics>;
}

interface AnalyticsEvent {
  userId?: string;
  sessionId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  userAgent: string;
  ipAddress: string;
}

interface RealtimeStats {
  activeUsers: number;
  pageViews: number;
  conversionRate: number;
  topProducts: Product[];
  recentEvents: AnalyticsEvent[];
}
```

**Analytics Routes (`backend/src/routes/analytics.routes.ts`)**

- `POST /api/analytics/track` - Track event
- `GET /api/analytics/realtime` - Get real-time stats (admin)
- `GET /api/analytics/events` - Get events by time range (admin)
- `GET /api/analytics/metrics` - Get aggregated metrics (admin)

#### Frontend Components

**Analytics Hook (`frontend/lib/use-analytics.ts`)**

```typescript
interface UseAnalytics {
  trackPageView(page: string): void;
  trackEvent(eventType: string, data?: any): void;
  trackProductView(productId: string): void;
  trackAddToCart(productId: string, quantity: number): void;
  trackPurchase(orderId: string, total: number): void;
}
```

**Analytics Dashboard (`frontend/app/(dashboard)/admin/analytics/page.tsx`)**

- Real-time metrics cards
- Charts (line, bar, pie)
- Event timeline
- Auto-refresh every 30 seconds

### 3. Internationalization (i18n)

#### Implementation Strategy

**Library:** `next-intl` (recommended for Next.js App Router)

**Supported Languages:**

- Romanian (ro) - default
- English (en)
- French (fr)

#### File Structure

```
frontend/
├── messages/
│   ├── en.json
│   ├── ro.json
│   └── fr.json
├── middleware.ts (locale detection)
└── i18n.ts (configuration)
```

#### Translation Files Structure

```json
{
  "common": {
    "welcome": "Welcome",
    "login": "Login",
    "logout": "Logout"
  },
  "products": {
    "title": "Products",
    "addToCart": "Add to Cart",
    "price": "Price"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "checkout": "Checkout"
  }
}
```

#### Frontend Components

**Language Switcher (`frontend/components/LanguageSwitcher.tsx`)**

- Dropdown with flags
- Persist selection
- Update URL locale

**Translation Hook**

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('products');
t('addToCart'); // "Add to Cart"
```

### 4. WebSocket Real-time Notifications

#### Backend Components

**WebSocket Server (`backend/src/websocket/server.ts`)**

```typescript
interface WebSocketServer {
  initialize(server: FastifyInstance): void;
  sendToUser(userId: string, notification: Notification): void;
  broadcast(notification: Notification): void;
  handleConnection(socket: Socket): void;
  handleDisconnection(socket: Socket): void;
}
```

**Notification Service (`backend/src/services/notification.service.ts`)**

```typescript
interface NotificationService {
  createNotification(
    notification: CreateNotificationDto
  ): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
}

interface Notification {
  id: string;
  userId: string;
  type: 'order_update' | 'promotion' | 'system' | 'message';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}
```

#### Frontend Components

**WebSocket Hook (`frontend/lib/use-websocket.ts`)**

```typescript
interface UseWebSocket {
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  markAsRead(id: string): void;
  clearAll(): void;
}
```

**Notification Center (`frontend/components/NotificationCenter.tsx`)**

- Bell icon with badge
- Dropdown with notification list
- Mark as read functionality
- Real-time updates

**Toast Notifications (`frontend/components/ToastNotification.tsx`)**

- Auto-dismiss after 5 seconds
- Different types (success, info, warning, error)
- Sound notification (optional)

## Data Models

### Analytics Event Model

```prisma
model AnalyticsEvent {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  sessionId   String
  eventType   String
  eventData   Json
  timestamp   DateTime @default(now())
  userAgent   String
  ipAddress   String

  @@index([userId])
  @@index([eventType])
  @@index([timestamp])
}
```

### Notification Model

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String
  title     String
  message   String
  data      Json?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([read])
  @@index([createdAt])
}
```

### User Model Extension

```prisma
model User {
  // ... existing fields
  locale            String            @default("ro")
  notifications     Notification[]
  analyticsEvents   AnalyticsEvent[]
}
```

## Error Handling

### OpenAI API Errors

- Rate limit exceeded → Show cached recommendations
- API timeout → Fallback to rule-based recommendations
- Invalid API key → Log error, disable AI features

### WebSocket Errors

- Connection lost → Auto-reconnect with exponential backoff
- Message send failed → Queue message for retry
- Authentication failed → Redirect to login

### Analytics Errors

- Tracking failed → Queue event for retry
- Database full → Implement data retention policy
- Invalid event data → Log and skip

### i18n Errors

- Missing translation → Fallback to English
- Invalid locale → Use default (Romanian)
- Translation file not found → Use key as fallback

## Testing Strategy

### Unit Tests

- OpenAI service methods
- Analytics aggregation logic
- Notification service CRUD
- Translation utilities

### Integration Tests

- OpenAI API integration
- WebSocket connection/disconnection
- Analytics event tracking
- i18n middleware

### E2E Tests

- AI chatbot conversation flow
- Real-time notification delivery
- Language switching
- Analytics dashboard updates

## Security Considerations

### OpenAI API

- Store API key in environment variables
- Rate limit AI endpoints (10 requests/minute per user)
- Moderate user input before sending to OpenAI
- Don't expose API key to frontend

### WebSocket

- Authenticate connections with JWT
- Validate user permissions for notifications
- Prevent message injection
- Rate limit messages per connection

### Analytics

- Anonymize IP addresses (GDPR compliance)
- Don't track sensitive data (passwords, payment info)
- Implement data retention policy (90 days)
- Admin-only access to analytics dashboard

### i18n

- Sanitize translated content
- Validate locale parameter
- Prevent XSS in translations

## Performance Optimization

### OpenAI API

- Cache recommendations for 1 hour
- Implement request queuing
- Use streaming for chat responses
- Batch similar requests

### Analytics

- Use background jobs for aggregation
- Implement data partitioning by date
- Cache real-time stats for 10 seconds
- Use indexes on frequently queried fields

### WebSocket

- Limit connections per user (max 3)
- Implement message batching
- Use Redis for pub/sub in production
- Compress large messages

### i18n

- Preload translations at build time
- Use static generation for translated pages
- Cache translation files
- Lazy load large translation namespaces

## Deployment Considerations

### Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# WebSocket
WEBSOCKET_PORT=3002
REDIS_URL=redis://localhost:6379

# Analytics
ANALYTICS_RETENTION_DAYS=90
ANALYTICS_BATCH_SIZE=100

# i18n
DEFAULT_LOCALE=ro
SUPPORTED_LOCALES=ro,en,fr
```

### Infrastructure

- OpenAI: Direct API calls (no additional infrastructure)
- WebSocket: Socket.io server (can use Redis adapter for scaling)
- Analytics: PostgreSQL (consider TimescaleDB for time-series)
- i18n: Static files (no additional infrastructure)

### Monitoring

- Track OpenAI API usage and costs
- Monitor WebSocket connection count
- Alert on analytics processing delays
- Log translation fallbacks
