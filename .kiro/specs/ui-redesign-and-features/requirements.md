# Requirements Document

## Introduction

This document outlines the requirements for a comprehensive UI/UX redesign and feature enhancement of the e-commerce platform. The redesign focuses on improving user experience through a modern navigation system, advanced filtering capabilities, real-time order tracking, and enhanced administrative controls. The system will provide a seamless shopping experience with features like favorites, voucher management, product offers with automatic discount calculation, and comprehensive profile management with avatar support.

## Glossary

- **System**: The e-commerce web application
- **User**: A registered customer who can browse products, make purchases, and manage their profile
- **Admin**: An administrator with elevated privileges to manage products, orders, users, and vouchers
- **Navbar**: The global navigation bar displayed across all pages
- **Avatar**: User profile picture or initials-based placeholder
- **Voucher**: A discount code with validity period and usage limits
- **Offer**: A promotional discount applied to products with automatic price calculation
- **Cart**: Shopping cart containing selected products for purchase
- **Order Status**: Real-time tracking state of an order (Processing, Preparing, Shipping, Delivered)
- **Favorite**: A product saved by the user for quick access
- **Category**: Product classification for filtering and organization
- **Carousel**: Auto-scrolling image slider displaying promotional offers
- **Navigation History**: Recently viewed products by the user
- **Checkout Modal**: Confirmation dialog before finalizing an order
- **Voucher Request**: User-initiated request for a voucher requiring admin approval

## Requirements

### Requirement 1: Global Navigation System

**User Story:** As a user, I want a consistent navigation bar across all pages including login and register, so that I can easily access key features regardless of where I am in the application.

#### Acceptance Criteria

1. THE System SHALL display a navigation bar on all pages including authentication pages
2. WHEN a user clicks the logo, THE System SHALL navigate to the homepage
3. THE System SHALL display a functional search bar with a search icon in the navbar
4. THE System SHALL display "Contact" and "About" buttons in the center of the navbar
5. THE System SHALL display user avatar or initials, username, and a dropdown menu in the right section of the navbar
6. WHEN a user clicks the avatar or username, THE System SHALL display a dropdown menu with options for Profile Settings, Favorites, My Orders, My Vouchers, Order History, and Logout/Login
7. THE System SHALL display a shopping cart icon with a badge showing the number of items in the navbar

### Requirement 2: Homepage Layout and Structure

**User Story:** As a user, I want a well-organized homepage with easy access to products, offers, and navigation history, so that I can quickly find what I'm looking for.

#### Acceptance Criteria

1. THE System SHALL display a left sidebar with "Products" (expandable with categories) and "Offers" menu items
2. THE System SHALL display a right sidebar with an "AI" button
3. THE System SHALL display a carousel section with auto-scrolling promotional offer images
4. THE System SHALL display a navigation history section showing up to 10 recently viewed products
5. WHEN a user navigates through the history carousel and reaches the end, THE System SHALL loop back to the beginning
6. THE System SHALL display an "All Products" section with a grid layout
7. THE System SHALL display a footer section with contact information

### Requirement 3: Product Filtering and Sorting

**User Story:** As a user, I want advanced filtering and sorting options for products, so that I can easily find products that match my preferences.

#### Acceptance Criteria

1. WHEN a user selects a category, THE System SHALL display only products from that category
2. WHEN a user selects "All Categories", THE System SHALL display products from all categories
3. THE System SHALL provide filtering options by category and search query
4. THE System SHALL provide sorting options by price (ascending/descending), alphabetical order (A-Z, Z-A), and rating
5. THE System SHALL display products in a grid layout with 5 columns and 10 products per page
6. WHEN products exceed 10 items, THE System SHALL display pagination controls
7. THE System SHALL display a heart icon on each product card for adding to favorites

### Requirement 4: Product Details and Favorites

**User Story:** As a user, I want to view detailed product information and save products to my favorites, so that I can make informed purchase decisions and easily access products I'm interested in.

#### Acceptance Criteria

1. WHEN a user clicks on a product, THE System SHALL navigate to a dedicated product details page
2. THE System SHALL display comprehensive product information including images, description, price, rating, and stock availability
3. WHEN a user clicks the heart icon on a product, THE System SHALL add the product to their favorites list
4. THE System SHALL provide a "Favorites" section in the user dropdown menu
5. WHEN a user accesses favorites, THE System SHALL display all saved products

### Requirement 5: User Profile Management

**User Story:** As a user, I want to manage my profile information including uploading a profile picture, so that I can personalize my account and keep my information up to date.

#### Acceptance Criteria

1. THE System SHALL allow users to upload a profile picture
2. WHEN a user has no profile picture, THE System SHALL display a colored circle with the user's initials
3. THE System SHALL allow users to edit their name, email, phone number, address, and password
4. WHEN a user updates profile information, THE System SHALL validate and save the changes
5. THE System SHALL display the updated avatar or initials in the navbar immediately after changes

### Requirement 6: Shopping Cart and Checkout Process

**User Story:** As a user, I want to manage my cart items and delivery information with a confirmation step before placing an order, so that I can review and modify my order before finalizing it.

#### Acceptance Criteria

1. THE System SHALL allow users to edit, update, and delete delivery information in the cart
2. THE System SHALL allow users to modify product quantities and remove products from the cart
3. THE System SHALL provide payment method selection options including Card and Cash on Delivery
4. WHEN a user clicks "Place Order", THE System SHALL display a confirmation modal with all order details including payment method
5. THE System SHALL provide options in the confirmation modal to modify, cancel, or confirm the order
6. WHEN a user confirms the order, THE System SHALL process the order and update the order status
7. THE System SHALL calculate the total price including any applied vouchers or discounts

### Requirement 7: Real-time Order Status Tracking

**User Story:** As a user, I want to see the real-time status of my orders, so that I can track my purchases from placement to delivery.

#### Acceptance Criteria

1. THE System SHALL display order status for each order (Processing, Preparing, Shipping, Delivered)
2. WHEN order status changes, THE System SHALL update the display in real-time
3. THE System SHALL provide an "Order History" section accessible from the user dropdown menu
4. THE System SHALL display all past and current orders with their respective statuses

### Requirement 8: Voucher Request System

**User Story:** As a user, I want to create voucher requests that are sent to administrators for approval, so that I can potentially receive discounts on my purchases.

#### Acceptance Criteria

1. THE System SHALL allow users to create voucher requests with a description or reason
2. WHEN a user submits a voucher request, THE System SHALL send it automatically to administrators
3. THE System SHALL display the status of voucher requests (Pending, Approved, Rejected)
4. WHEN an admin approves a voucher request, THE System SHALL make the voucher available for the user to use
5. THE System SHALL display approved vouchers in the "My Vouchers" section

### Requirement 9: Administrator Order Management

**User Story:** As an admin, I want full control over orders including creating, editing, deleting, and changing order status, so that I can efficiently manage the order fulfillment process.

#### Acceptance Criteria

1. THE System SHALL allow admins to view all orders in the system
2. THE System SHALL allow admins to create new orders manually
3. THE System SHALL allow admins to edit order details including products, quantities, and delivery information
4. THE System SHALL allow admins to delete orders
5. THE System SHALL allow admins to change order status (Processing, Preparing, Shipping, Delivered)
6. WHEN an admin changes order status, THE System SHALL update the status visible to the user in real-time

### Requirement 10: Administrator Product Management

**User Story:** As an admin, I want to manage products including adding, editing, deleting, and updating stock levels, so that I can maintain an accurate product catalog.

#### Acceptance Criteria

1. THE System SHALL allow admins to add new products with name, price, stock, image, category, and description
2. THE System SHALL allow admins to edit existing products including price, stock, name, image, and category
3. THE System SHALL allow admins to delete products from the catalog
4. THE System SHALL allow admins to update stock quantities in real-time
5. WHEN stock is updated, THE System SHALL reflect the changes immediately on the product pages

### Requirement 11: Administrator Offer Management with Automatic Discount Calculation

**User Story:** As an admin, I want to create and manage promotional offers that automatically calculate and display discounted prices, so that customers can see savings in real-time.

#### Acceptance Criteria

1. THE System SHALL allow admins to create offers with product selection, discount percentage or fixed amount, and validity period
2. THE System SHALL allow admins to edit existing offers including discount value and validity period
3. THE System SHALL allow admins to delete offers
4. WHEN an offer is active, THE System SHALL automatically calculate and display the discounted price on product pages
5. THE System SHALL display active offers in the "Offers" section and homepage carousel
6. WHEN an offer expires, THE System SHALL automatically remove the discount and restore the original price

### Requirement 12: Administrator User Management

**User Story:** As an admin, I want to manage user accounts including adding, deleting, and changing user roles, so that I can control access and permissions within the system.

#### Acceptance Criteria

1. THE System SHALL allow admins to view all user accounts
2. THE System SHALL allow admins to create new user accounts
3. THE System SHALL allow admins to delete user accounts
4. THE System SHALL allow admins to change user roles between User and Admin
5. THE System SHALL allow admins to edit user details including name, email, phone, and address

### Requirement 13: Administrator Voucher Management

**User Story:** As an admin, I want to create and manage vouchers with validity periods and usage limits, so that I can provide targeted discounts to customers.

#### Acceptance Criteria

1. THE System SHALL allow admins to create vouchers with code, discount value, validity period (start and end date), and maximum usage count
2. THE System SHALL allow admins to edit voucher details including validity period and usage limits
3. THE System SHALL allow admins to delete vouchers
4. THE System SHALL allow admins to send vouchers directly to specific users
5. WHEN a voucher validity period expires, THE System SHALL automatically delete the voucher
6. WHEN a voucher reaches its maximum usage count, THE System SHALL automatically delete the voucher from user accounts
7. THE System SHALL allow admins to approve or reject voucher requests from users
8. WHEN an admin approves a voucher request, THE System SHALL create and assign the voucher to the requesting user

### Requirement 14: Functional Search System

**User Story:** As a user, I want to search for products using the navbar search bar, so that I can quickly find specific items.

#### Acceptance Criteria

1. THE System SHALL provide a search input field in the navbar
2. WHEN a user enters a search query and clicks the search icon, THE System SHALL display products matching the query
3. THE System SHALL search across product names, descriptions, and categories
4. THE System SHALL display search results in the same grid layout as the products page
5. THE System SHALL apply the same filtering and sorting options to search results

### Requirement 15: Contact and About Pages

**User Story:** As a user, I want to access Contact and About pages from the navbar with active contact information, so that I can learn more about the business and get in touch easily.

#### Acceptance Criteria

1. THE System SHALL display "Contact" and "About" navigation links in the navbar on all pages
2. WHEN a user clicks "Contact", THE System SHALL navigate to the contact page
3. WHEN a user clicks "About", THE System SHALL navigate to the about page
4. THE System SHALL display contact information including phone number and email on the contact page
5. WHEN a user clicks the phone number, THE System SHALL initiate a phone call using the tel: protocol
6. WHEN a user clicks the email address, THE System SHALL open the default email client using the mailto: protocol
7. THE System SHALL display the same contact information in the homepage footer section
