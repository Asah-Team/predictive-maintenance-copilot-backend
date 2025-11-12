# 🛠️ Developer Guide - Predictive Maintenance API

Dokumentasi API untuk Frontend Developer.

## 📋 Table of Contents

- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Common Exceptions](#common-exceptions)
- [Security Notes](#security-notes)

---

## 🔐 Authentication Flow

### Complete Authentication Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SIGN UP                                                  │
└─────────────────────────────────────────────────────────────┘
POST /auth/signup
  ↓
User created in Supabase (email not verified)
  ↓
Email sent automatically
  ↓
Session = null (cannot sign in yet)


┌─────────────────────────────────────────────────────────────┐
│ 2. EMAIL VERIFICATION                                        │
└─────────────────────────────────────────────────────────────┘
User clicks link in email
  ↓
Browser opens: /auth/verify-email#access_token=...
  ↓
JavaScript parses hash fragment
  ↓
POST /auth/verify-email/callback { accessToken }
  ↓
Backend creates user in local DB
  ↓
Email verified ✅


┌─────────────────────────────────────────────────────────────┐
│ 3. SIGN IN                                                   │
└─────────────────────────────────────────────────────────────┘
POST /auth/signin
  ↓
Returns { accessToken, refreshToken }
  ↓
Store tokens in localStorage/sessionStorage


┌─────────────────────────────────────────────────────────────┐
│ 4. AUTHENTICATED REQUESTS                                    │
└─────────────────────────────────────────────────────────────┘
GET /auth/me
Headers: { Authorization: "Bearer <accessToken>" }
  ↓
Backend validates token with Supabase
  ↓
Returns user data


┌─────────────────────────────────────────────────────────────┐
│ 5. SIGN OUT                                                  │
└─────────────────────────────────────────────────────────────┘
POST /auth/signout
Headers: { Authorization: "Bearer <accessToken>" }
  ↓
Session invalidated in Supabase
  ↓
Token becomes invalid immediately
  ↓
Clear tokens from storage
```

---

## 📡 API Endpoints

### Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

---

## 🏭 Machine Management API

### 1. Create Machine

**Endpoint:** `POST /machines`  
**Auth:** Required (Admin, Operator)

**Request:**
```json
{
  "productId": "L47181",
  "type": "L",
  "name": "Machine L47181",
  "description": "Low quality variant machine",
  "location": "Factory Floor 2",
  "installationDate": "2023-02-06",
  "lastMaintenanceDate": "2024-06-22",
  "status": "operational"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "productId": "L47181",
  "type": "L",
  "name": "Machine L47181",
  "description": "Low quality variant machine",
  "location": "Factory Floor 2",
  "installationDate": "2023-02-06T00:00:00.000Z",
  "lastMaintenanceDate": "2024-06-22T00:00:00.000Z",
  "status": "operational",
  "createdAt": "2025-11-12T00:00:00.000Z",
  "updatedAt": "2025-11-12T00:00:00.000Z"
}
```

---

### 2. Get All Machines

**Endpoint:** `GET /machines`  
**Auth:** Required (All roles)

**Query Parameters:**
- `search` (optional) - Search by name, productId, or location
- `type` (optional) - Filter by type: L, M, H
- `status` (optional) - Filter by status: operational, maintenance, offline, retired
- `location` (optional) - Filter by location
- `includeStats` (optional) - Include sensor readings count (true/false)
- `limit` (optional) - Results per page (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Example:** `GET /machines?type=L&status=operational&limit=10`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "L47181",
      "type": "L",
      "name": "Machine L47181",
      "status": "operational",
      "_count": {
        "sensorReadings": 150
      }
    }
  ],
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 3. Get Machine by ID

**Endpoint:** `GET /machines/:id`  
**Auth:** Required (All roles)

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "productId": "L47181",
  "type": "L",
  "name": "Machine L47181",
  "description": "Low quality variant machine",
  "location": "Factory Floor 2",
  "installationDate": "2023-02-06T00:00:00.000Z",
  "lastMaintenanceDate": "2024-06-22T00:00:00.000Z",
  "status": "operational",
  "_count": {
    "sensorReadings": 150
  },
  "createdAt": "2025-11-12T00:00:00.000Z",
  "updatedAt": "2025-11-12T00:00:00.000Z"
}
```

---

### 4. Get Machine Statistics

**Endpoint:** `GET /machines/:id/stats`  
**Auth:** Required (All roles)

**Response:** `200 OK`
```json
{
  "machine": {
    "id": "uuid",
    "productId": "L47181",
    "name": "Machine L47181",
    "status": "operational"
  },
  "statistics": {
    "sensorReadingsCount": 150,
    "predictionsCount": 0,
    "criticalPredictions": 0,
    "latestPrediction": null
  }
}
```

---

### 5. Update Machine

**Endpoint:** `PATCH /machines/:id`  
**Auth:** Required (Admin, Operator)

**Request:** (All fields optional)
```json
{
  "name": "Updated Machine Name",
  "status": "maintenance",
  "location": "Factory Floor 3",
  "lastMaintenanceDate": "2025-11-12"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "productId": "L47181",
  "name": "Updated Machine Name",
  "status": "maintenance",
  "updatedAt": "2025-11-12T00:00:00.000Z"
}
```

---

### 6. Delete Machine

**Endpoint:** `DELETE /machines/:id`  
**Auth:** Required (Admin only)

**Response:** `200 OK`
```json
{
  "message": "Machine deleted successfully"
}
```

---

## 📊 Sensors API

### 1. Create Sensor Reading

**Endpoint:** `POST /sensors`  
**Auth:** Required (Admin, Operator)

**Request:**
```json
{
  "machineId": "uuid",
  "productId": "L47181",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 1450,
  "torque": 42.3,
  "toolWear": 85,
  "timestamp": "2025-11-12T10:30:00Z"
}
```

**Response:** `201 Created`
```json
{
  "udi": 123,
  "machineId": "uuid",
  "productId": "L47181",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 1450,
  "torque": 42.3,
  "toolWear": 85,
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

---

### 2. Create Batch Sensor Readings

**Endpoint:** `POST /sensors/batch`  
**Auth:** Required (Admin, Operator)

**Request:** (Max 100 readings per request)
```json
{
  "readings": [
    {
      "machineId": "uuid",
      "productId": "L47181",
      "airTemp": 298.5,
      "processTemp": 308.2,
      "rotationalSpeed": 1450,
      "torque": 42.3,
      "toolWear": 85,
      "timestamp": "2025-11-12T10:30:00Z"
    },
    {
      "machineId": "uuid",
      "productId": "L47181",
      "airTemp": 299.1,
      "processTemp": 308.8,
      "rotationalSpeed": 1460,
      "torque": 43.1,
      "toolWear": 86,
      "timestamp": "2025-11-12T10:31:00Z"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "count": 2,
  "message": "Successfully created 2 sensor readings"
}
```

---

### 3. Get Sensor Readings

**Endpoint:** `GET /sensors`  
**Auth:** Required (All roles)

**Query Parameters:**
- `machineId` (optional) - Filter by machine
- `startDate` (optional) - Filter by start date (ISO 8601)
- `endDate` (optional) - Filter by end date (ISO 8601)
- `limit` (optional) - Results per page (default: 100, max: 1000)
- `offset` (optional) - Pagination offset (default: 0)

**Example:** `GET /sensors?machineId=uuid&startDate=2025-11-01&limit=50`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "udi": 123,
      "machineId": "uuid",
      "productId": "L47181",
      "airTemp": 298.5,
      "processTemp": 308.2,
      "rotationalSpeed": 1450,
      "torque": 42.3,
      "toolWear": 85,
      "timestamp": "2025-11-12T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 4. Get Sensor Reading by UDI

**Endpoint:** `GET /sensors/:udi`  
**Auth:** Required (All roles)

**Response:** `200 OK`
```json
{
  "udi": 123,
  "machineId": "uuid",
  "productId": "L47181",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 1450,
  "torque": 42.3,
  "toolWear": 85,
  "timestamp": "2025-11-12T10:30:00.000Z",
  "machine": {
    "id": "uuid",
    "productId": "L47181",
    "name": "Machine L47181",
    "type": "L",
    "status": "operational"
  }
}
```

---

### 5. Get Sensor Statistics

**Endpoint:** `GET /sensors/statistics/:machineId`  
**Auth:** Required (All roles)

**Query Parameters:**
- `limit` (optional) - Number of recent readings to analyze (default: 100)

**Response:** `200 OK`
```json
{
  "machineId": "uuid",
  "readingsAnalyzed": 100,
  "statistics": {
    "airTemp": {
      "min": 295.2,
      "max": 302.5,
      "avg": 298.5,
      "median": 298.3
    },
    "processTemp": {
      "min": 305.1,
      "max": 312.8,
      "avg": 308.2,
      "median": 308.0
    },
    "rotationalSpeed": {
      "min": 1200,
      "max": 1600,
      "avg": 1450,
      "median": 1455
    },
    "torque": {
      "min": 30.5,
      "max": 50.2,
      "avg": 42.3,
      "median": 42.1
    },
    "toolWear": {
      "min": 0,
      "max": 200,
      "avg": 85,
      "median": 82
    }
  }
}
```

---

### 6. Delete Sensor Reading

**Endpoint:** `DELETE /sensors/:udi`  
**Auth:** Required (Admin only)

**Response:** `200 OK`
```json
{
  "message": "Sensor reading deleted successfully"
}
```

---

## 🔐 Authentication API

### 1. Sign Up (Registration)

**Endpoint:** `POST /auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Validation:**
- `email`: Valid email format, required
- `password`: Min 6 characters, required
- `fullName`: Optional

**Success Response (201):**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "email": "user@example.com"
  },
  "session": null
}
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 400 | Bad Request | Invalid email/password format |
| 409 | Conflict | Email already registered |
| 500 | Internal Server Error | Database/Supabase error |

---

### 2. Email Verification

#### GET `/auth/verify-email`
- Returns HTML page dengan JavaScript
- Dipanggil otomatis dari link email
- Parse token dari URL hash fragment

#### POST `/auth/verify-email/callback`

**Request:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "type": "signup"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "email": "user@example.com"
}
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 401 | Unauthorized | Invalid/expired token |
| 400 | Bad Request | Missing access token |

---

### 3. Resend Verification Email

**Endpoint:** `POST /auth/resend-verification`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Verification email has been resent. Please check your inbox."
}
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 400 | Bad Request | Invalid email |
| 404 | Not Found | Email not registered |
| 429 | Too Many Requests | Rate limit exceeded |

---

### 4. Sign In (Login)

**Endpoint:** `POST /auth/signin`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Sign in successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "4e3c8f9a-b2d1-4a7c-9e6f-1d8c3b7a5e2f",
  "expiresIn": 3600
}
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 401 | Unauthorized | Invalid credentials / Email not verified |
| 400 | Bad Request | Missing email/password |
| 403 | Forbidden | Account inactive |

> 💡 **Note:** Store `accessToken` dan `refreshToken` di localStorage untuk request selanjutnya.

---

### 5. Get Profile (Me)

**Endpoint:** `GET /auth/me`

**Authentication:** Required ✅

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "supabaseId": "uuid...",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "isActive": true,
  "createdAt": "2025-11-11T00:00:00.000Z",
  "updatedAt": "2025-11-11T00:00:00.000Z"
}
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 401 | Unauthorized | Missing/Invalid token |
| 401 | Unauthorized | Session invalidated (after sign out) |
| 403 | Forbidden | Account inactive |

---

### 6. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request:**
```json
{
  "refreshToken": "4e3c8f9a-b2d1-4a7c-9e6f-1d8c3b7a5e2f"
}
```

**Success Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "new-refresh-token-here",
  "expiresIn": 3600
}
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 401 | Unauthorized | Invalid/expired refresh token |
| 400 | Bad Request | Missing refresh token |

---

### 7. Sign Out (Logout)

**Endpoint:** `POST /auth/signout`

**Authentication:** Required ✅

**Headers:**
```json
{
  "Authorization": "Bearer <accessToken>"
}
```

**Success Response (200):**
```json
{
  "message": "Sign out successful"
}
```

> ⚠️ **Important:** Token langsung invalid setelah sign out. Clear tokens dari storage dan redirect ke sign in.

---

### 8. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset email sent. Please check your inbox."
}
```

**Error Responses:**

| Status | Error | Reason |
|--------|-------|--------|
| 400 | Bad Request | Invalid email |
| 404 | Not Found | Email not registered |
| 429 | Too Many Requests | Rate limit exceeded |

---

## 🚨 Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "timestamp": "2025-11-11T12:00:00.000Z",
  "path": "/auth/signin",
  "method": "POST",
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### Error Status Codes

| Code | Name | Description | Action |
|------|------|-------------|--------|
| 400 | Bad Request | Invalid input/validation failed | Fix request data |
| 401 | Unauthorized | Missing/invalid authentication | Sign in again |
| 403 | Forbidden | No permission | Check user role |
| 404 | Not Found | Resource not found | Check endpoint |
| 409 | Conflict | Resource already exists | Use different data |
| 429 | Too Many Requests | Rate limit exceeded | Wait and retry |
| 500 | Internal Server Error | Server error | Retry or contact support |

---

## ⚠️ Common Exceptions

### 1. Email Not Verified
**Error:** `401 - Please verify your email before signing in`
**Action:** Show resend verification email option

### 2. Session Invalidated
**Error:** `401 - Session has been invalidated`
**Action:** Clear storage, redirect to sign in

### 3. Token Expired
**Error:** `401 - Unauthorized`
**Action:** Try refresh token, if failed redirect to sign in

### 4. Rate Limit Exceeded
**Error:** `429 - Too many requests`
**Action:** Show wait time message, disable button temporarily

---

## 🔒 Security Notes

### Token Storage
- ✅ Use `localStorage` untuk SPA
- ❌ Jangan store di cookies tanpa httpOnly flag
- ❌ Jangan expose token di URL

### Token Management
- Check token expiry sebelum request
- Implement auto-refresh mechanism menggunakan interceptor
- Clear tokens dari storage setelah sign out
- Validate token di server untuk setiap protected endpoint

### Best Practices
- Always use HTTPS di production
- Implement CORS dengan whitelist domains
- Set token expiry sesuai kebutuhan (default: 1 hour)
- Implement rate limiting untuk prevent abuse

---

## 📞 Testing

### Postman Collection
Import collection dari `postman/Predictive-Maintenance-API.postman_collection.json` untuk testing semua endpoints.

### Testing Flow
1. Sign Up → Check email
2. Verify Email → Click link di email
3. Sign In → Simpan access token
4. Get Profile → Test dengan token
5. Sign Out → Test token jadi invalid
6. Try Get Profile → Harus return 401

---

**Happy Coding! 🚀**
