# Implementation Plan - Bonus Features

- [ ] 1. Set up OpenAI API Integration

  - Install OpenAI SDK and configure API key
  - Create OpenAI service with error handling
  - Implement rate limiting for AI endpoints
  - _Requirements: 1.5_

  - [x] 1.1 Create OpenAI service layer

    - Install `openai` package in backend
    - Create `backend/src/services/openai.service.ts` with methods for recommendations, chat, and description generation
    - Implement error handling and fallbacks for API failures
    - Add request caching with 1-hour TTL

    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 1.2 Implement AI product recommendations

    - Create `POST /api/ai/recommendations` endpoint

    - Generate recommendations based on product description and user history
    - Return top 5 recommended products
    - Add fallback to manual recommendations if AI fails
    - _Requirements: 1.1_

  - [ ] 1.3 Implement AI chatbot backend

    - Create `POST /api/ai/chat` endpoint with conversation context
    - Implement system prompt for e-commerce assistant
    - Store conversation history in session
    - Add content moderation before sending to OpenAI
    - _Requirements: 1.2, 1.3_

  - [ ] 1.4 Implement AI description generator for admin

    - Create `POST /api/ai/generate-description` endpoint (admin only)
    - Generate product descriptions based on title and category
    - Return formatted description with key features
    - _Requirements: 1.4_

  - [x] 1.5 Create AI chatbot frontend component

    - Create `frontend/components/AIChatbot.tsx` with floating button
    - Implement chat interface with message history
    - Add typing indicator and loading states
    - Display AI responses with markdown support
    - Add error handling and retry mechanism
    - _Requirements: 1.2, 1.3_

  - [ ] 1.6 Create AI recommendations frontend component

    - Create `frontend/components/AIRecommendations.tsx`
    - Display recommendations on product detail page
    - Add loading skeleton and error states
    - Implement click tracking for recommendations
    - _Requirements: 1.1_

  - [ ] 1.7 Add AI description generator to admin product form
    - Add "Generate with AI" button to product form
    - Call AI endpoint and populate description field
    - Show loading state during generation
    - Allow editing of generated description
    - _Requirements: 1.4_

- [ ] 2. Implement Real-time Analytics

  - Set up analytics database models
  - Create analytics tracking service
  - Build admin analytics dashboard
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.1 Create analytics database models

    - Add `AnalyticsEvent` model to Prisma schema
    - Add `locale` field to User model
    - Create migration for new models
    - Add indexes for performance (userId, eventType, timestamp)
    - _Requirements: 2.1, 2.3_

  - [x] 2.2 Create analytics service layer

    - Create `backend/src/services/analytics.service.ts`
    - Implement `trackEvent` method with validation
    - Implement `getRealtimeStats` with aggregation queries
    - Implement `aggregateMetrics` for historical data
    - Add data retention cleanup job (90 days)
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 2.3 Create analytics API routes

    - Create `POST /api/analytics/track` endpoint (public)
    - Create `GET /api/analytics/realtime` endpoint (admin only)
    - Create `GET /api/analytics/events` endpoint (admin only)
    - Create `GET /api/analytics/metrics` endpoint (admin only)
    - Add rate limiting (100 track events per minute per user)
    - _Requirements: 2.1, 2.2_

  - [x] 2.4 Create analytics tracking hook

    - Create `frontend/lib/use-analytics.ts` hook
    - Implement `trackPageView`, `trackEvent`, `trackProductView`, `trackAddToCart`, `trackPurchase` methods
    - Add automatic page view tracking
    - Queue failed events for retry
    - _Requirements: 2.1, 2.3_

  - [x] 2.5 Integrate analytics tracking throughout frontend

    - Add page view tracking to layout
    - Track product views on product page
    - Track add to cart events
    - Track checkout and purchase events
    - Track user registration and login
    - _Requirements: 2.3_

  - [x] 2.6 Create analytics dashboard page

    - Create `frontend/app/(dashboard)/admin/analytics/page.tsx`
    - Display real-time metrics cards (active users, page views, conversion rate)
    - Add charts for events over time (line chart)
    - Display top products table
    - Show recent events timeline
    - Implement auto-refresh every 30 seconds
    - _Requirements: 2.2, 2.5_

  - [ ] 2.7 Create analytics chart components

    - Create `frontend/components/analytics/MetricCard.tsx`

    - Create `frontend/components/analytics/LineChart.tsx` using Chart.js or Recharts
    - Create `frontend/components/analytics/EventTimeline.tsx`
    - Add loading states and error handling
    - _Requirements: 2.2, 2.5_

- [x] 3. Implement Internationalization (i18n)

  - Set up next-intl for Next.js
  - Create translation files for 3 languages
  - Implement language switcher
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.1 Install and configure next-intl

    - Install `next-intl` package in frontend
    - Create `frontend/i18n.ts` configuration file
    - Create `frontend/middleware.ts` for locale detection
    - Configure supported locales (ro, en, fr)
    - _Requirements: 3.1, 3.3_

  - [x] 3.2 Create translation files

    - Create `frontend/messages/en.json` with all English translations
    - Create `frontend/messages/ro.json` with all Romanian translations
    - Create `frontend/messages/fr.json` with all French translations
    - Organize translations by namespace (common, products, cart, auth, admin)
    - _Requirements: 3.1, 3.2_

  - [x] 3.3 Update app structure for i18n

    - Wrap app with `NextIntlClientProvider`
    - Update routing to support locale parameter
    - Configure default locale and fallback
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 3.4 Replace hardcoded strings with translations

    - Update all components to use `useTranslations` hook
    - Replace hardcoded strings in auth pages
    - Replace hardcoded strings in product pages
    - Replace hardcoded strings in cart and checkout
    - Replace hardcoded strings in admin pages
    - _Requirements: 3.2, 3.6_

  - [x] 3.5 Create language switcher component

    - Create `frontend/components/LanguageSwitcher.tsx`
    - Add dropdown with language options and flags
    - Persist language selection in localStorage
    - Update URL with selected locale
    - Add to header/navigation
    - _Requirements: 3.2, 3.4_

  - [x] 3.6 Implement locale-aware formatting

    - Format dates using locale (Intl.DateTimeFormat)
    - Format numbers using locale (Intl.NumberFormat)
    - Format currency with proper symbols (RON, USD, EUR)
    - _Requirements: 3.5_

  - [x] 3.7 Update backend to support user locale preference

    - Add locale field to User model (already in 2.1)
    - Update user profile endpoint to save locale
    - Return user locale in auth responses
    - _Requirements: 3.4_

- [ ] 4. Implement WebSocket Real-time Notifications

  - Set up Socket.io server and client
  - Create notification system
  - Build notification UI components
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ] 4.1 Create notification database model

    - Add `Notification` model to Prisma schema
    - Create migration for notifications table
    - Add indexes for userId, read status, and createdAt
    - _Requirements: 4.7_

  - [x] 4.2 Set up Socket.io server

    - Install `socket.io` in backend
    - Create `backend/src/websocket/server.ts`
    - Initialize Socket.io with Fastify server
    - Implement JWT authentication for WebSocket connections
    - Handle connection and disconnection events
    - _Requirements: 4.1, 4.6_

  - [x] 4.3 Create notification service

    - Create `backend/src/services/notification.service.ts`
    - Implement CRUD operations for notifications
    - Implement `sendToUser` method for targeted notifications
    - Implement `broadcast` method for all users
    - Add notification types (order_update, promotion, system, message)
    - _Requirements: 4.2, 4.3, 4.7_

  - [x] 4.4 Create notification API routes

    - Create `GET /api/notifications` endpoint to fetch user notifications
    - Create `PUT /api/notifications/:id/read` endpoint to mark as read
    - Create `DELETE /api/notifications/:id` endpoint to delete
    - Create `POST /api/notifications/broadcast` endpoint (admin only)
    - _Requirements: 4.4, 4.7_

  - [ ] 4.5 Integrate notifications with existing features

    - Send notification when order status changes
    - Send notification when admin creates new voucher/promotion
    - Send notification for low stock alerts (admin)
    - Send welcome notification on user registration
    - _Requirements: 4.2, 4.3_

  - [ ] 4.6 Create WebSocket client hook

    - Create `frontend/lib/use-websocket.ts` hook
    - Implement connection management with auto-reconnect
    - Handle incoming notifications
    - Maintain notification state
    - Implement exponential backoff for reconnection
    - _Requirements: 4.1, 4.5, 4.6_

  - [x] 4.7 Create notification center component

    - Create `frontend/components/NotificationCenter.tsx`
    - Add bell icon with unread badge in header
    - Implement dropdown with notification list
    - Add mark as read functionality
    - Add delete notification functionality
    - Show empty state when no notifications
    - _Requirements: 4.4, 4.7_

  - [ ] 4.8 Create toast notification component

    - Create `frontend/components/ToastNotification.tsx`
    - Display toast for real-time notifications
    - Auto-dismiss after 5 seconds
    - Support different types (success, info, warning, error)
    - Add sound notification (optional, with user preference)
    - Stack multiple toasts
    - _Requirements: 4.4_

  - [ ] 4.9 Integrate WebSocket throughout frontend

    - Connect WebSocket on user login

    - Disconnect on logout
    - Display toast for incoming notifications
    - Update notification center in real-time
    - Update notification badge count
    - _Requirements: 4.1, 4.4, 4.6_

- [x] 5. Testing and Documentation

  - Write tests for all bonus features
  - Update documentation
  - _Requirements: All_

  - [x] 5.1 Write tests for OpenAI integration

    - Test OpenAI service methods with mocked API
    - Test AI endpoints with authentication
    - Test error handling and fallbacks
    - Test rate limiting
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 5.2 Write tests for analytics

    - Test analytics service aggregation logic
    - Test analytics tracking endpoint
    - Test analytics dashboard data fetching
    - Test data retention cleanup
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 5.3 Write tests for i18n

    - Test locale detection middleware
    - Test translation fallbacks
    - Test language switcher
    - Test locale-aware formatting
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 5.4 Write tests for WebSocket notifications

    - Test WebSocket connection and authentication
    - Test notification delivery
    - Test notification CRUD operations
    - Test auto-reconnection logic
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 5.5 Update README with bonus features

    - Document OpenAI setup and API key configuration
    - Document analytics features and dashboard
    - Document supported languages and i18n setup
    - Document WebSocket notifications
    - Add screenshots of new features
    - _Requirements: All_

  - [x] 5.6 Create bonus features demo video

    - Record demo of AI chatbot interaction
    - Show analytics dashboard with real-time updates
    - Demonstrate language switching
    - Show real-time notifications in action
    - _Requirements: All_
