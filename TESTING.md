# 🧪 Testing Guide

## Backend Tests

### Run all tests

```bash
cd backend
npm test
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Build TypeScript

```bash
npm run build
```

## Frontend Tests

### Build production

```bash
cd frontend
npm run build
```

### Run development server

```bash
npm run dev
```

## Integration Testing

### 1. Start Backend

```bash
cd backend
npm run dev
```

Backend will start on http://localhost:3001

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will start on http://localhost:3000

### 3. Test Flow

1. **Health Check**

   - Visit: http://localhost:3001/health
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Register New User**

   - Go to: http://localhost:3000/register
   - Fill form with:
     - Name: Test User
     - Email: test@example.com
     - Password: Test1234
   - Click "Register"
   - Should redirect to login

3. **Login**

   - Go to: http://localhost:3000/login
   - Use credentials from step 2
   - Should redirect to dashboard

4. **Dashboard**
   - Should see dashboard with stats
   - Navigation should work

## API Testing with cURL

### Register

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

### Get Current User (with token)

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Test Results Summary

✅ **Backend**

- All unit tests passing (9/9)
- TypeScript compiles without errors
- No diagnostic issues

✅ **Frontend**

- Build successful
- No TypeScript errors
- All pages render correctly

✅ **Integration**

- Auth flow works end-to-end
- API communication functional
- Forms validate correctly

## Known Issues

None at this time!

## Next Steps

1. Add more comprehensive E2E tests with Cypress
2. Add integration tests for data CRUD operations
3. Test on different browsers
4. Test responsive design on mobile devices
