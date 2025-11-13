# Implementation Plan

- [x] 1. Update database schema and migrations

  - Add new models and fields to Prisma schema (Favorite, NavigationHistory, Offer, ProductOffer, VoucherRequest, avatar field, paymentMethod field)
  - Create and run database migrations
  - Update seed data to include sample offers and categories
  - _Requirements: All requirements depend on updated schema_

- [x] 2. Implement avatar upload and user profile enhancements

  - [x] 2.1 Create avatar upload endpoint with file validation

    - Implement POST /api/users/avatar endpoint with multer middleware
    - Validate file type (jpg, png, gif) and size (max 5MB)
    - Store uploaded files in public/uploads/avatars directory
    - Return avatar URL in response
    - _Requirements: 5.1, 5.5_

  - [x] 2.2 Create Avatar component with initials fallback

    - Build Avatar component that displays image or colored circle with initials
    - Generate consistent colors based on user ID
    - Support multiple sizes (sm, md, lg)
    - _Requirements: 5.2, 5.5_

  - [x] 2.3 Update profile page with avatar upload and full edit capabilities

    - Add avatar upload UI with preview
    - Create form for editing name, email, phone, address, password
    - Implement client-side validation
    - Connect to backend API endpoints
    - _Requirements: 5.1, 5.3, 5.4_

- [x] 3. Build global navigation system

  - [x] 3.1 Create unified Navbar component

    - Build Navbar with logo, search bar, center links (Contact, About), user dropdown, cart icon
    - Implement search functionality with debouncing
    - Add user dropdown menu with Avatar component
    - Display cart item count badge
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 14.1_

  - [x] 3.2 Create MainLayout wrapper for authenticated pages

    - Wrap all authenticated pages with MainLayout including Navbar
    - Ensure consistent layout across all pages
    - _Requirements: 1.1_

  - [x] 3.3 Update authentication pages to include Navbar

    - Add Navbar to login and register pages
    - Adjust layout to accommodate navigation bar
    - _Requirements: 1.1_

- [x] 4. Implement Contact and About pages

  - [x] 4.1 Create Contact page with active links

    - Build contact page with phone (tel:) and email (mailto:) links
    - Add contact form for inquiries
    - Display business address and hours
    - _Requirements: 15.2, 15.4, 15.5, 15.6_

  - [x] 4.2 Create About page

    - Build about page with company information
    - Add mission, values, and team sections
    - _Requirements: 15.3_

  - [x] 4.3 Add contact information to homepage footer

    - Create footer component with contact details
    - Use same active phone and email links
    - _Requirements: 2.7, 15.7_

- [x] 5. Develop homepage layout and components

  - [x] 5.1 Create Sidebar component with categories

    - Build left sidebar with expandable product categories
    - Add "All Categories" option
    - Implement "Offers" link
    - Add right sidebar with AI button
    - _Requirements: 2.1, 2.2_

  - [x] 5.2 Implement Carousel component for offers

    - Create auto-scrolling carousel with 5-second intervals
    - Add manual navigation controls (prev/next)
    - Display offer images with titles
    - Implement pause on hover
    - _Requirements: 2.3_

  - [x] 5.3 Build Navigation History component

    - Create horizontal scrollable product list
    - Fetch and display last 10 viewed products
    - Implement circular navigation (loop to beginning)
    - Add left/right navigation arrows
    - _Requirements: 2.4, 2.5_

  - [x] 5.4 Create homepage with all sections

    - Assemble homepage with sidebar, carousel, navigation history, products grid, footer
    - Implement responsive layout
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7_

- [x] 6. Implement favorites system

  - [x] 6.1 Create favorites backend API

    - Implement GET /api/favorites endpoint
    - Implement POST /api/favorites/:productId endpoint
    - Implement DELETE /api/favorites/:productId endpoint
    - _Requirements: 4.4_

  - [x] 6.2 Add heart icon to product cards

    - Display heart icon on all product cards
    - Toggle favorite status on click
    - Show filled heart for favorited products
    - _Requirements: 3.7, 4.3_

  - [x] 6.3 Create Favorites page

    - Build favorites page displaying all saved products
    - Use same product grid layout
    - Add to user dropdown menu
    - _Requirements: 4.4, 4.5, 1.6_

- [x] 7. Build advanced product filtering and pagination

  - [x] 7.1 Create ProductFilters component

    - Build filter UI with category dropdown
    - Add sort options (price, alphabetical, rating)
    - Add sort order toggle (asc/desc)
    - _Requirements: 3.3, 3.4_

  - [x] 7.2 Implement backend filtering and sorting

    - Update GET /api/products endpoint with query parameters
    - Implement category filtering
    - Implement sorting by price, name, rating
    - Implement pagination (10 items per page)
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [x] 7.3 Create ProductGrid component with pagination

    - Build 5-column grid layout
    - Display 10 products per page (5×2)
    - Add pagination controls (prev, next, page numbers)
    - _Requirements: 3.5, 3.6_

  - [x] 7.4 Update products page with filters and grid

    - Integrate ProductFilters and ProductGrid components
    - Connect to backend API with query parameters
    - Handle loading and error states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 8. Create product details page

  - [x] 8.1 Build product details page

    - Create dedicated page for single product
    - Display comprehensive product information (images, description, price, rating, stock)
    - Add "Add to Cart" and "Add to Favorites" buttons
    - Show product reviews
    - _Requirements: 4.1, 4.2_

  - [x] 8.2 Implement navigation history tracking

    - Create POST /api/history/:productId endpoint
    - Track product views when user visits product details page
    - Limit history to last 10 products per user
    - _Requirements: 2.4_

- [x] 9. Enhance shopping cart with payment method and delivery management

  - [x] 9.1 Add delivery information management to cart

    - Create UI for editing delivery name, address, phone
    - Add delete button to clear delivery information
    - Implement PUT /api/cart/delivery and DELETE /api/cart/delivery endpoints
    - _Requirements: 6.1, 6.2_

  - [x] 9.2 Add payment method selection

    - Create payment method selector (Card, Cash on Delivery)
    - Store selected payment method in cart state
    - Display payment method in cart summary
    - _Requirements: 6.3_

  - [x] 9.3 Create CheckoutModal component

    - Build modal with complete order summary
    - Display products, quantities, prices, delivery info, payment method
    - Calculate total with discounts
    - Add Modify, Cancel, Confirm buttons
    - _Requirements: 6.4, 6.5, 6.6_

  - [x] 9.4 Update cart page with checkout flow

    - Integrate CheckoutModal into cart page
    - Show modal when "Place Order" is clicked
    - Handle order confirmation and creation
    - _Requirements: 6.4, 6.5, 6.6_

- [x] 10. Implement real-time order status tracking

  - [x] 10.1 Add order status display to orders page

    - Show order status badges (Processing, Preparing, Shipping, Delivered)
    - Display status timeline/progress indicator
    - _Requirements: 7.1, 7.3_

  - [x] 10.2 Create order history page

    - Build page displaying all user orders with statuses
    - Add to user dropdown menu
    - Show order details on click
    - _Requirements: 7.3, 7.4, 1.6_

- [x] 11. Build voucher request system

  - [x] 11.1 Create voucher request backend API

    - Implement POST /api/vouchers/request endpoint
    - Implement GET /api/vouchers/requests endpoint (admin)
    - Implement PUT /api/vouchers/requests/:id endpoint for approval/rejection (admin)
    - _Requirements: 8.2, 13.7_

  - [x] 11.2 Create voucher request form for users

    - Build form for creating voucher requests with description
    - Display request status (Pending, Approved, Rejected)
    - Show in "My Vouchers" section
    - _Requirements: 8.1, 8.3_

  - [x] 11.3 Add voucher request management to admin panel

    - Display all voucher requests in admin dashboard
    - Add approve/reject buttons
    - Create voucher automatically on approval
    - _Requirements: 8.4, 13.8_

- [x] 12. Implement offer management with automatic discount calculation

  - [x] 12.1 Create offers backend API

    - Implement POST /api/offers endpoint (admin)
    - Implement PUT /api/offers/:id endpoint (admin)
    - Implement DELETE /api/offers/:id endpoint (admin)
    - Implement GET /api/offers endpoint for active offers
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 12.2 Implement automatic discount calculation

    - Update product price display to show discounted price when offer is active
    - Calculate discount in real-time based on offer percentage
    - Show original price with strikethrough and discounted price
    - _Requirements: 11.4, 11.6_

  - [x] 12.3 Display offers in carousel and offers section

    - Fetch active offers for carousel
    - Create offers page listing all active offers
    - Link offers to filtered product pages
    - _Requirements: 11.5_

  - [x] 12.4 Create offer management UI in admin panel

    - Build form for creating offers (title, description, image, discount, validity, products)
    - Add edit and delete functionality
    - Display all offers with active/expired status
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 13. Build comprehensive admin dashboard

  - [x] 13.1 Create order management interface

    - Build orders table with all order details
    - Add status dropdown for changing order status
    - Implement edit order functionality
    - Add delete order button
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 13.2 Create product management interface

    - Build products table with CRUD operations
    - Add form for creating/editing products (name, price, stock, image, category, description)
    - Implement stock update functionality
    - Add delete product button
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 13.3 Create user management interface

    - Build users table displaying all users
    - Add form for creating new users
    - Implement role change functionality (User ↔ Admin)
    - Add edit user details functionality
    - Add delete user button
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 13.4 Create voucher management interface

    - Build vouchers table with CRUD operations
    - Add form for creating vouchers (code, discount, type, max usage, validity period)
    - Implement send voucher to user functionality
    - Add edit and delete functionality
    - Display voucher requests with approve/reject actions
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.7, 13.8_

- [x] 14. Implement automated voucher and offer expiration

  - [x] 14.1 Create scheduled job for voucher expiration

    - Set up node-cron job to run daily
    - Delete vouchers where validUntil < current date and usedAt is null
    - Delete user vouchers when voucher reaches maxUsage
    - _Requirements: 13.5, 13.6_

  - [x] 14.2 Create scheduled job for offer expiration
    - Set up node-cron job to run hourly
    - Deactivate offers where validUntil < current date
    - _Requirements: 11.6_

- [x] 15. Implement functional search system

  - [x] 15.1 Create search backend endpoint

    - Implement GET /api/search endpoint with query parameter
    - Search across product names, descriptions, and categories
    - Return results with same structure as products endpoint
    - _Requirements: 14.2, 14.3_

  - [x] 15.2 Integrate search into Navbar

    - Connect search input to search endpoint with debouncing
    - Navigate to search results page on submit
    - Display search results using ProductGrid component
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

- [x] 16. Add navigation history cleanup job

  - Create scheduled job to clean old navigation history (keep last 30 days)
  - Run weekly to maintain database performance
  - _Requirements: Performance optimization_

- [ ]\* 17. Testing and validation

  - [ ]\* 17.1 Write unit tests for key services

    - Test user service (avatar upload, profile update)
    - Test voucher service (expiration, usage tracking)
    - Test offer service (discount calculation)
    - _Requirements: All requirements_

  - [ ]\* 17.2 Write integration tests for API endpoints

    - Test authentication flow
    - Test product filtering and pagination
    - Test cart to order conversion with payment method
    - Test voucher request and approval flow
    - _Requirements: All requirements_

  - [ ]\* 17.3 Perform end-to-end testing
    - Test complete user purchase flow
    - Test admin management workflows
    - Test favorites and navigation history
    - Test offer discount calculation
    - _Requirements: All requirements_

- [ ]\* 18. Documentation and deployment preparation

  - [ ]\* 18.1 Update API documentation

    - Document all new endpoints
    - Add request/response examples
    - Update authentication requirements
    - _Requirements: All requirements_

  - [ ]\* 18.2 Update README with new features
    - Document new UI components
    - Add setup instructions for file uploads
    - Document scheduled jobs configuration
    - _Requirements: All requirements_
