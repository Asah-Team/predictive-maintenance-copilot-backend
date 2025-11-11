# 🏭 Predictive Maintenance API<p align="center">

  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

Backend API untuk sistem Predictive Maintenance dengan autentikasi Supabase.</p>



## 📋 Prerequisites[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

- Node.js >= 18

- PostgreSQL (via Supabase)  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

- npm atau yarn    <p align="center">

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

## 🚀 Quick Start<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

### 1. Clone Repository<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

```bash<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

git clone <repository-url><a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

cd predictive-maintenance-copilot-backend  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

```    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

### 2. Install Dependencies</p>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

```bash  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

npm install

```## Description



### 3. Setup Environment[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.



Buat file `.env` di root folder:## Project setup



```env```bash

# Database (Supabase)$ npm install

DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"```

DIRECT_URL="postgresql://user:password@host:5432/postgres"

## Compile and run the project

# Supabase Configuration

SUPABASE_URL="https://your-project.supabase.co"```bash

SUPABASE_ANON_KEY="your-anon-key"# development

SUPABASE_JWT_SECRET="your-jwt-secret"$ npm run start



# Application# watch mode

PORT=3000$ npm run start:dev

NODE_ENV=development

APP_URL="http://localhost:3000"# production mode

```$ npm run start:prod

```

> 💡 **Penting:** Ambil `SUPABASE_JWT_SECRET` dari Supabase Dashboard → Project Settings → API → JWT Settings (bukan service_role key!)

## Run tests

### 4. Setup Database

```bash

```bash# unit tests

# Generate Prisma Client$ npm run test

npm run prisma:generate

# e2e tests

# Push schema ke database$ npm run test:e2e

npm run prisma:push

# test coverage

# (Opsional) Seed data untuk testing$ npm run test:cov

npm run seed```

```

## Deployment

### 5. Run Application

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

```bash

# Development mode (dengan hot reload)If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

npm run start:dev

```bash

# Production mode$ npm install -g @nestjs/mau

npm run start:prod$ mau deploy

``````



Server akan berjalan di `http://localhost:3000`With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.



## 📚 API Documentation## Resources



### Base URLCheck out a few resources that may come in handy when working with NestJS:

```

http://localhost:3000- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

```- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

### Authentication Endpoints- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

| Endpoint | Method | Auth | Description |- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

|----------|--------|------|-------------|- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

| `/auth/signup` | POST | ❌ | Daftar user baru |- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

| `/auth/signin` | POST | ❌ | Login user |

| `/auth/me` | GET | ✅ | Get profile user |## Support

| `/auth/refresh` | POST | ❌ | Refresh access token |

| `/auth/signout` | POST | ✅ | Logout user |Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

| `/auth/reset-password` | POST | ❌ | Reset password |

| `/auth/verify-email` | GET | ❌ | Halaman verifikasi email |## Stay in touch

| `/auth/resend-verification` | POST | ❌ | Kirim ulang email verifikasi |

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

### Example Usage- Website - [https://nestjs.com](https://nestjs.com/)

- Twitter - [@nestframework](https://twitter.com/nestframework)

#### 1. Sign Up (Daftar)

## License

```bash

POST /auth/signupNest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

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
src/
├── auth/                 # Authentication module
│   ├── decorators/       # Custom decorators (@Public, @Roles)
│   ├── dto/              # Data Transfer Objects
│   ├── guards/           # Auth guards (JWT, Roles)
│   ├── strategies/       # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── supabase.service.ts
├── common/               # Shared modules
│   ├── filters/          # Exception filters
│   └── prisma/           # Prisma service
├── machine/              # Machine module
├── sensors/              # Sensors module
├── user/                 # User module
├── app.module.ts
└── main.ts
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

### Error: "SUPABASE_JWT_SECRET is not defined"

**Solusi:** Pastikan `.env` file ada dan `SUPABASE_JWT_SECRET` diisi dengan JWT Secret dari Supabase Dashboard (bukan service_role key).

### Error: "Invalid credentials" saat sign in

**Penyebab:** Email belum diverifikasi

**Solusi:** 
1. Cek email inbox untuk link verifikasi
2. Klik link verifikasi
3. Coba login lagi

### Error: "Session has been invalidated" saat get profile

**Penyebab:** Token sudah tidak valid (setelah sign out atau expired)

**Solusi:** Login ulang untuk mendapatkan token baru

### Email verifikasi tidak sampai

**Solusi:**
1. Cek spam folder
2. Gunakan endpoint `/auth/resend-verification` untuk kirim ulang

## 📖 Documentation untuk Developer

Untuk dokumentasi lengkap tentang API endpoints, error handling, dan integration guide, lihat:

**[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**

## 🤝 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

## 📝 License

[MIT License](LICENSE)
