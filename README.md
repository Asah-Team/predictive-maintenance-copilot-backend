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
