# � Predictive Maintenance API

Backend API untuk sistem Predictive Maintenance menggunakan NestJS, PostgreSQL, dan Supabase Auth.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Testing](#-testing-dengan-postman)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)

---

## ✨ Features

- ✅ Authentication dengan Supabase (Sign Up, Sign In, Sign Out)
- ✅ Email Verification
- ✅ JWT Token & Refresh Token
- ✅ Session Management (token invalid setelah logout)
- ✅ Role-Based Access Control
- ✅ Input Validation dengan Zod
- ✅ PostgreSQL dengan Prisma ORM
- ✅ RESTful API Design

---

## 🛠 Tech Stack

- **Framework:** NestJS 11.x
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 6.x
- **Authentication:** Supabase Auth + Passport JWT
- **Validation:** Zod + nestjs-zod
- **Language:** TypeScript

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- PostgreSQL database (Supabase account)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd predictive-maintenance-copilot-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Copy `.env.example` ke `.env` dan isi:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT (optional - auto-generated if empty)
JWT_SECRET="your-jwt-secret"

# App
PORT=3000
NODE_ENV=development
```

4. **Setup database**
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke database
npm run prisma:push

# (Optional) Seed sample data
npm run seed
```

5. **Run aplikasi**
```bash
# Development mode dengan hot reload
npm run start:dev

# Production mode
npm run start:prod
```

Server akan running di `http://localhost:3000`

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

### Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/signup` | POST | ❌ | Daftar user baru |
| `/auth/signin` | POST | ❌ | Login user |
| `/auth/me` | GET | ✅ | Get profile user |
| `/auth/refresh` | POST | ❌ | Refresh access token |
| `/auth/signout` | POST | ✅ | Logout user |
| `/auth/reset-password` | POST | ❌ | Reset password |
| `/auth/verify-email` | GET | ❌ | Halaman verifikasi email |
| `/auth/verify-email/callback` | POST | ❌ | Callback verifikasi email |
| `/auth/resend-verification` | POST | ❌ | Kirim ulang email verifikasi |

### Example Usage

#### 1. Sign Up (Daftar)

```bash
POST /auth/signup

Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "email": "user@example.com"
  }
}
```

> ⚠️ **Penting:** Setelah sign up, cek email untuk verifikasi. User belum bisa login sebelum email diverifikasi.

#### 2. Verify Email

- Buka link verifikasi dari email
- Otomatis redirect ke halaman sukses
- Setelah verified, baru bisa login

#### 3. Sign In (Login)

```bash
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
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
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600
}
```

> 💾 **Simpan accessToken** untuk request selanjutnya!

#### 4. Get Profile

```bash
GET /auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
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

#### 5. Sign Out (Logout)

```bash
POST /auth/signout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "message": "Sign out successful"
}
```

> ✅ Setelah sign out, token tidak bisa digunakan lagi!

## 🧪 Testing dengan Postman

1. Import collection dari `postman/Predictive-Maintenance-API.postman_collection.json`
2. Import environment dari `postman/environments/`
3. Pilih environment (Local/Development/Production)
4. Test endpoints sesuai urutan:
   - Sign Up → Verify Email → Sign In → Get Profile → Sign Out

## 📦 Database Seeding

Untuk testing, Anda bisa seed data sample:

```bash
npm run seed
```

Ini akan membuat:
- 4 mesin (machines)
- Sensor untuk setiap mesin
- Sample data untuk testing

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Run aplikasi (production) |
| `npm run start:dev` | Run dengan hot reload |
| `npm run start:prod` | Run production build |
| `npm run build` | Build aplikasi |
| `npm run lint` | Check code linting |
| `npm run test` | Run unit tests |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema ke database |
| `npm run prisma:studio` | Buka Prisma Studio |
| `npm run seed` | Seed sample data |

## 📁 Project Structure

```
predictive-maintenance-copilot-backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── decorators/        # @Public, @Roles decorators
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── guards/            # JWT & Roles guards
│   │   ├── strategies/        # Passport JWT strategy
│   │   ├── auth.controller.ts # Auth endpoints
│   │   ├── auth.service.ts    # Auth business logic
│   │   └── supabase.service.ts# Supabase integration
│   ├── common/                # Shared modules
│   │   ├── filters/           # Exception filters
│   │   └── prisma/            # Prisma service
│   ├── machine/               # Machine module
│   ├── sensors/               # Sensors module
│   ├── user/                  # User module
│   ├── app.module.ts          # Root module
│   └── main.ts                # Entry point
├── test/                      # E2E tests
├── postman/                   # Postman collections
├── .env                       # Environment variables
├── package.json
└── README.md
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Supabase integration
- ✅ Email verification
- ✅ Session validation (token invalid setelah logout)
- ✅ Role-based access control
- ✅ Password hashing (handled by Supabase)
- ✅ Input validation dengan Zod

## 🐛 Troubleshooting

### ❌ Error: "Invalid credentials" saat sign in

**Penyebab:** Email belum diverifikasi atau password salah

**Solusi:** 
1. Pastikan email sudah diverifikasi (cek inbox)
2. Klik link verifikasi di email
3. Coba login lagi
4. Jika lupa password, gunakan `/auth/reset-password`

### ❌ Error: "Session has been invalidated"

**Penyebab:** Token sudah tidak valid (setelah sign out atau expired)

**Solusi:** Login ulang untuk mendapatkan token baru

### 📧 Email verifikasi tidak sampai

**Solusi:**
1. Cek spam/junk folder
2. Gunakan endpoint `/auth/resend-verification` untuk kirim ulang
3. Pastikan Supabase email service sudah configured

### 🔧 Database connection error

**Solusi:**
1. Pastikan `DATABASE_URL` dan `DIRECT_URL` sudah benar di `.env`
2. Check koneksi ke Supabase
3. Jalankan `npm run prisma:generate` dan `npm run prisma:push`

---

## 📖 Documentation

### Untuk Frontend Developer

Dokumentasi lengkap tentang API endpoints, error handling, dan integration guide:

👉 **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**

Berisi:
- Complete authentication flow
- Semua API endpoints dengan request/response format
- Error codes dan handling
- Common exceptions
- Security notes

---

## 🤝 Contributing

Contributions welcome! Silakan buat issue atau pull request.

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Baca [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) terlebih dahulu
2. Test dengan Postman collection
3. Check browser console dan network tab
4. Buat issue dengan detail error

---

**Built with ❤️ using NestJS**
