# Implementation Plan: Email Verification and Notification System

## Overview

This implementation plan breaks down the email verification and notification system into discrete coding tasks. The system will handle user registration verification, email changes, password change notifications, and phone number changes, all with verification codes sent via email in Romanian. The implementation includes comprehensive security measures: code hashing, rate limiting (5 codes/hour), attempt tracking (3 attempts/code), and account lockout (10 failures/hour).

## Tasks

- [ ] 1. Set up database schema and Prisma models
  - Create Prisma migrations for VerificationCode, PendingUser, SecurityLog, RateLimitAttempt, and AccountLockout models
  - Add emailVerified and emailVerifiedAt fields to existing User model
  - Create database indexes for efficient queries
  - Run migrations and generate Prisma client
  - _Requirements: 5.3, 9.1, 9.6_

- [ ] 2. Implement Verification Service core functionality
  - [ ] 2.1 Create verification service with code generation
    - Implement generateVerificationCode() using crypto.randomInt() for 6-digit codes
    - Implement hashCode() using bcrypt with 10 salt rounds
    - Implement verifyCodeHash() with constant-time comparison
    - Implement isCodeExpired() to check 15-minute expiration
    - _Requirements: 1.1, 5.1, 5.6_

  - [ ]\* 2.2 Write property test for code generation
    - **Property 1: Universal Code Generation**
    - **Validates: Requirements 1.1, 2.2, 4.1**

  - [ ]\* 2.3 Write property test for code hashing
    - **Property 2: Code Hashing Before Storage**
    - **Validates: Requirements 5.1**

  - [ ]\* 2.4 Write property test for hash-based validation
    - **Property 3: Hash-Based Validation**
    - **Validates: Requirements 1.3, 2.4, 4.3**

  - [ ] 2.5 Implement email registration verification methods
    - Implement sendEmailVerificationCode() to create PendingUser and VerificationCode
    - Implement verifyEmailCode() to validate code and create User account
    - Implement resendEmailCode() to invalidate old code and generate new one
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

  - [ ]\* 2.6 Write property tests for registration verification
    - **Property 4: Universal Code Expiration**
    - **Property 5: Code Resend Invalidation**
    - **Property 6: Attempt Limiting**
    - **Property 7: Registration Account Creation**
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.8**

  - [ ] 2.7 Implement email change verification methods
    - Implement sendEmailChangeCode() to generate code for new email
    - Implement verifyEmailChangeCode() to validate and update user email
    - _Requirements: 2.2, 2.3, 2.5_

  - [ ]\* 2.8 Write property tests for email change verification
    - **Property 8: Email Change Update**
    - **Validates: Requirements 2.5**

  - [ ] 2.9 Implement phone change verification methods
    - Implement sendPhoneChangeCode() to generate code sent to user's email
    - Implement verifyPhoneChangeCode() to validate and update user phone
    - _Requirements: 4.1, 4.2, 4.4_

  - [ ]\* 2.10 Write property tests for phone change verification
    - **Property 9: Phone Change Update**
    - **Validates: Requirements 4.4**

  - [ ]\* 2.11 Write property test for verified code reuse prevention
    - **Property 10: Verified Code Reuse Prevention**
    - **Validates: Requirements 5.5**

- [ ] 3. Implement Email Service with Romanian templates
  - [ ] 3.1 Create email service with template rendering
    - Set up email service using existing backend email infrastructure
    - Create Romanian email templates (HTML and plain text) for all verification types
    - Implement renderTemplate() method for dynamic content
    - Implement sendVerificationCode() for all verification types
    - _Requirements: 1.2, 8.1, 8.3, 8.6_

  - [ ] 3.2 Create email notification methods
    - Implement sendEmailChangeNotification() for old email notification
    - Implement sendPasswordChangeNotification() with timestamp, IP, device info, and warning
    - Implement sendAccountLockoutNotification() for locked accounts
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 7.4_

  - [ ]\* 3.3 Write property tests for email delivery
    - **Property 11: Verification Code Email Delivery**
    - **Property 12: Email Change Notification**
    - **Property 13: Password Change Notification**
    - **Property 14: Password Change Notification Content**
    - **Property 15: Romanian Language Emails**
    - **Property 16: Dual Format Email Support**
    - **Validates: Requirements 1.2, 2.1, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.2, 8.3, 8.6**

- [ ] 4. Implement Rate Limit Service
  - [ ] 4.1 Create rate limit service with tracking
    - Implement checkLimit() to verify if user can request codes (5 per hour)
    - Implement recordAttempt() to track code generation requests
    - Implement getRemainingWaitTime() to calculate wait time
    - Implement resetLimit() for testing and admin override
    - _Requirements: 6.1, 6.2, 6.4_

  - [ ]\* 4.2 Write property tests for rate limiting
    - **Property 17: Rate Limit Tracking**
    - **Property 18: Rate Limit Enforcement**
    - **Property 19: Rate Limit Error Messages**
    - **Property 20: Rate Limit Reset**
    - **Property 21: Cross-Type Rate Limiting**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [ ] 5. Implement Security Service with lockout management
  - [ ] 5.1 Create security service with attempt tracking
    - Implement recordVerificationAttempt() to log all attempts
    - Implement isAccountLocked() to check lockout status
    - Implement getFailedAttemptCount() to count failures in 1-hour window
    - Implement lockAccount() to lock after 10 failures
    - Implement unlockAccount() for automatic unlock after 1 hour
    - Implement logSecurityEvent() for comprehensive logging
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.6_

  - [ ]\* 5.2 Write property tests for security and lockout
    - **Property 22: Failed Attempt Logging**
    - **Property 23: Account Lockout Trigger**
    - **Property 24: Lockout Verification Blocking**
    - **Property 25: Lockout Notification**
    - **Property 26: Automatic Lockout Expiration**
    - **Property 27: Lockout Event Logging**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**

- [ ] 6. Create API routes for authentication
  - [ ] 6.1 Implement registration routes
    - Create POST /api/auth/register endpoint
    - Create POST /api/auth/verify-email endpoint
    - Create POST /api/auth/resend-email-code endpoint
    - Add request validation using Zod schemas
    - Integrate with VerificationService, RateLimitService, and SecurityService
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_

  - [ ]\* 6.2 Write unit tests for registration routes
    - Test successful registration flow
    - Test verification with valid code
    - Test verification with invalid code
    - Test code expiration
    - Test rate limiting
    - Test account lockout
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8_

- [ ] 7. Create API routes for user account changes
  - [ ] 7.1 Implement email change routes
    - Create POST /api/user/change-email endpoint (authenticated)
    - Create POST /api/user/verify-email-change endpoint (authenticated)
    - Add JWT authentication middleware
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [ ] 7.2 Implement phone change routes
    - Create POST /api/user/change-phone endpoint (authenticated)
    - Create POST /api/user/verify-phone-change endpoint (authenticated)
    - Create POST /api/user/resend-phone-code endpoint (authenticated)
    - _Requirements: 4.1, 4.2, 4.4, 4.7_

  - [ ] 7.3 Implement password change route with notification
    - Create POST /api/user/change-password endpoint (authenticated)
    - Integrate with EmailService to send notification
    - Capture IP address and device info from request
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]\* 7.4 Write unit tests for account change routes
    - Test email change flow
    - Test phone change flow
    - Test password change with notification
    - Test authentication requirements
    - _Requirements: 2.1, 2.5, 3.1, 4.4_

- [ ] 8. Implement error handling with Romanian messages
  - [ ] 8.1 Create error message constants and utilities
    - Define all error messages in Romanian (ERROR_MESSAGES constant)
    - Create error response formatter
    - Implement error handling middleware for API routes
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.8_

  - [ ]\* 8.2 Write property tests for error messages
    - **Property 33: Success Message Localization**
    - **Property 34: Send Failure Error Messages**
    - **Property 35: Invalid Code Error Messages**
    - **Property 36: Expired Code Error Messages**
    - **Property 37: Lockout Error Messages**
    - **Property 38: Success Verification Messages**
    - **Property 39: Max Attempts Error Messages**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.6, 10.7, 10.8**

- [ ] 9. Implement data storage and cleanup
  - [ ] 9.1 Create database query methods
    - Implement code storage with complete metadata
    - Implement code querying by user identifier and type
    - Implement security event logging
    - Implement audit trail for expired codes
    - _Requirements: 5.3, 5.4, 9.1, 9.2, 9.3_

  - [ ]\* 9.2 Write property tests for data storage
    - **Property 28: Complete Code Storage**
    - **Property 29: Code Audit Trail**
    - **Property 30: Code Query Support**
    - **Property 31: Comprehensive Security Logging**
    - **Validates: Requirements 5.3, 5.4, 9.1, 9.2, 9.3**

  - [ ] 9.3 Implement automated cleanup job
    - Create cron job to delete codes older than 24 hours
    - Create cron job to unlock expired account lockouts
    - Schedule jobs to run daily
    - _Requirements: 9.4_

  - [ ]\* 9.4 Write property test for expired code cleanup
    - **Property 32: Expired Code Cleanup**
    - **Validates: Requirements 9.4**

- [ ] 10. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Verify test coverage meets 80% minimum
  - Verify all 39 correctness properties are tested
  - Ensure all error messages are in Romanian
  - Ask the user if questions arise

- [ ] 11. Integration and end-to-end testing
  - [ ] 11.1 Create integration test suite
    - Test complete registration flow (register → verify → login)
    - Test complete email change flow (request → verify → confirm)
    - Test complete phone change flow (request → verify → confirm)
    - Test password change with notification
    - Test rate limiting across multiple requests
    - Test account lockout and automatic unlock
    - _Requirements: All requirements_

  - [ ]\* 11.2 Write integration tests for edge cases
    - Test concurrent code requests
    - Test code expiration edge cases (exactly 15 minutes)
    - Test attempt limiting edge cases (exactly 3 attempts)
    - Test rate limiting edge cases (exactly 5 requests)
    - Test lockout edge cases (exactly 10 failures)
    - _Requirements: 1.5, 1.8, 6.2, 7.2_

- [ ] 12. Documentation and deployment preparation
  - [ ] 12.1 Create API documentation
    - Document all API endpoints with request/response examples
    - Document error codes and messages
    - Document rate limiting and security measures
    - Create Postman collection or OpenAPI spec
    - _Requirements: All requirements_

  - [ ] 12.2 Create deployment checklist
    - Document environment variables needed
    - Document database migration steps
    - Document email service configuration
    - Document monitoring and alerting setup
    - Create deployment guide
    - _Requirements: All requirements_

- [ ] 13. Final checkpoint - Ensure all tests pass
  - Run complete test suite (unit + property + integration)
  - Verify all 39 correctness properties pass
  - Verify Romanian language in all emails and errors
  - Verify security measures (hashing, rate limiting, lockout)
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (39 total)
- Unit tests validate specific examples and edge cases
- All emails and error messages must be in Romanian
- Security is paramount: codes are hashed, rate limited, and attempt-tracked
- fast-check library is already installed in the project for property-based testing
