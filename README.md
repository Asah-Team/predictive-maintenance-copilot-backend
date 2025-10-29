# Predictive Maintenance Copilot - Backend

Backend API untuk sistem Predictive Maintenance dengan realtime sensor monitoring menggunakan NestJS, Prisma, PostgreSQL (Supabase), dan WebSocket.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Machines API](#machines-api)
  - [Sensor Readings API](#sensor-readings-api)
- [Realtime Features](#realtime-features)
- [Testing](#testing)

---

## ✨ Features

- 🏭 **Machine Management** - CRUD operations untuk mesin dengan Product ID dari dataset
- 📊 **Sensor Data Collection** - Collect dan store sensor readings (temperature, speed, torque, tool wear)
- 🔄 **Realtime Updates** - WebSocket untuk live sensor data streaming
- 📈 **Statistics & Analytics** - Aggregated statistics untuk sensor readings
- 🔍 **Machine Validation** - Automatic validation of machine existence sebelum sensor operations
- 🗄️ **PostgreSQL Database** - Menggunakan Supabase dengan connection pooling
- 🎯 **Type Safety** - Full TypeScript dengan Zod validation

---

## 🛠️ Tech Stack

- **Framework**: NestJS 11.1.7
- **Language**: TypeScript 5.1.3
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.18.0
- **Validation**: Zod + nestjs-zod
- **Realtime**: Socket.io + Supabase Realtime
- **Testing**: Jest

---

## 📦 Prerequisites

- Node.js >= 18.x
- npm atau yarn
- PostgreSQL database (atau akun Supabase)
- Git

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/papermintx/predictive-maintenance-copilot-backend.git
cd predictive-maintenance-copilot-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory:

```env
# Database Connection (Direct - untuk migrations)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# Database Connection (Pooled - untuk aplikasi)
DATABASE_URL_POOLED="postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true"

# Application
PORT=3000
NODE_ENV=development

# Supabase Configuration (untuk realtime features)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**Supabase Connection Strings:**
- Port `5432` = Direct connection (untuk migrations)
- Port `6543` = Pooled connection dengan PgBouncer (untuk aplikasi)

---

## 🗄️ Database Setup

### 1. Generate Prisma Client

```bash
npm run prisma:generate
```

### 2. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 3. Seed Database

Populate database dengan initial data (3 machines + 300 sensor readings):

```bash
npm run prisma:seed
```

**Seeded Machines:**
- `M23839` (Type: M - Medium)
- `L56160` (Type: L - Low)
- `H38406` (Type: H - High)

### 4. View Database (Optional)

```bash
npx prisma studio
```

---

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

Server akan berjalan di: `http://localhost:3000`

### Production Mode

```bash
npm run build
npm run start:prod
```

### Simulate Realtime Sensor Data

Untuk testing realtime features, jalankan simulator di terminal terpisah:

```bash
npm run simulate:sensors
```

Ini akan generate sensor readings setiap 5 detik untuk semua machines.

---

## 📚 API Documentation

Base URL: `http://localhost:3000`

### Machines API

#### 1. Create Machine

**POST** `/machines`

Membuat machine baru berdasarkan dataset predictive maintenance.

**Request Body:**
```json
{
  "productId": "M24000",
  "type": "M"
}
```

**Parameters:**
- `productId` (string, required): Product ID dari dataset (contoh: M23839, L56160, H38406)
- `type` (enum, required): Machine type - `"L"` (Low), `"M"` (Medium), atau `"H"` (High)

**Response:** `201 Created`
```json
{
  "id": "uuid-v4",
  "productId": "M24000",
  "type": "M"
}
```

**Error Responses:**
- `400 Bad Request` - Validation error atau productId sudah ada
- `500 Internal Server Error` - Database error

---

#### 2. Get All Machines

**GET** `/machines?includeStats=true`

Mendapatkan daftar semua machines dengan optional statistics.

**Query Parameters:**
- `includeStats` (boolean, optional): Include sensor reading count. Default: `false`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-1",
    "productId": "M23839",
    "type": "M",
    "_count": {
      "sensorReadings": 150
    }
  },
  {
    "id": "uuid-2",
    "productId": "L56160",
    "type": "L",
    "_count": {
      "sensorReadings": 120
    }
  }
]
```

---

#### 3. Get Single Machine

**GET** `/machines/:id`

Mendapatkan detail machine berdasarkan UUID.

**URL Parameters:**
- `id` (uuid, required): Machine UUID

**Response:** `200 OK`
```json
{
  "id": "uuid-1",
  "productId": "M23839",
  "type": "M"
}
```

**Error Responses:**
- `404 Not Found` - Machine tidak ditemukan

---

#### 4. Get Machine Statistics

**GET** `/machines/:id/stats`

Mendapatkan machine dengan sensor reading statistics dan latest readings.

**URL Parameters:**
- `id` (uuid, required): Machine UUID

**Response:** `200 OK`
```json
{
  "id": "uuid-1",
  "productId": "M23839",
  "type": "M",
  "_count": {
    "sensorReadings": 150
  },
  "sensorReadings": [
    {
      "udi": 300,
      "machineId": "uuid-1",
      "timestamp": "2024-01-29T10:30:00.000Z",
      "airTemp": 298.5,
      "processTemp": 308.2,
      "rotationalSpeed": 2850,
      "torque": 42.5,
      "toolWear": 150
    }
  ]
}
```

---

#### 5. Delete Machine

**DELETE** `/machines/:id`

Menghapus machine dari database.

**URL Parameters:**
- `id` (uuid, required): Machine UUID

**Response:** `200 OK`
```json
{
  "id": "uuid-1",
  "productId": "M23839",
  "type": "M"
}
```

**Error Responses:**
- `404 Not Found` - Machine tidak ditemukan
- `400 Bad Request` - Machine memiliki sensor readings (foreign key constraint)

---

### Sensor Readings API

#### 1. Create Sensor Reading

**POST** `/sensors/readings`

Membuat sensor reading baru. Machine akan dicari berdasarkan `productId`.

**Request Body:**
```json
{
  "productId": "M23839",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 2850,
  "torque": 42.5,
  "toolWear": 150,
  "timestamp": "2024-01-29T10:30:00.000Z"
}
```

**Parameters:**
- `productId` (string, required): Product ID dari machine
- `airTemp` (number, required): Air temperature dalam Kelvin (0-500)
- `processTemp` (number, required): Process temperature dalam Kelvin (0-500)
- `rotationalSpeed` (integer, required): Rotational speed dalam RPM (0-10000)
- `torque` (number, required): Torque dalam Nm (0-200)
- `toolWear` (integer, required): Tool wear dalam minutes (0-1000)
- `timestamp` (ISO 8601, optional): Timestamp reading. Default: `now()`

**Response:** `201 Created`
```json
{
  "udi": 301,
  "machineId": "uuid-1",
  "timestamp": "2024-01-29T10:30:00.000Z",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 2850,
  "torque": 42.5,
  "toolWear": 150,
  "machine": {
    "id": "uuid-1",
    "productId": "M23839",
    "type": "M"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `404 Not Found` - Machine dengan productId tidak ditemukan

---

#### 2. Get Sensor Readings

**GET** `/sensors/readings?machineId=uuid&limit=100`

Mendapatkan sensor readings dengan optional filtering.

**Query Parameters:**
- `machineId` (uuid, optional): Filter by machine UUID
- `limit` (integer, optional): Max results. Default: `100`

**Response:** `200 OK`
```json
[
  {
    "udi": 301,
    "machineId": "uuid-1",
    "timestamp": "2024-01-29T10:30:00.000Z",
    "airTemp": 298.5,
    "processTemp": 308.2,
    "rotationalSpeed": 2850,
    "torque": 42.5,
    "toolWear": 150,
    "machine": {
      "id": "uuid-1",
      "productId": "M23839",
      "type": "M"
    }
  }
]
```

**Error Responses:**
- `404 Not Found` - Machine tidak ditemukan (jika machineId provided)

---

#### 3. Get Latest Reading

**GET** `/sensors/readings/latest?machineId=uuid`

Mendapatkan sensor reading terbaru untuk machine tertentu.

**Query Parameters:**
- `machineId` (uuid, required): Machine UUID

**Response:** `200 OK`
```json
{
  "udi": 301,
  "machineId": "uuid-1",
  "timestamp": "2024-01-29T10:30:00.000Z",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 2850,
  "torque": 42.5,
  "toolWear": 150,
  "machine": {
    "id": "uuid-1",
    "productId": "M23839",
    "type": "M"
  }
}
```

**Error Responses:**
- `400 Bad Request` - machineId required
- `404 Not Found` - Machine tidak ditemukan atau belum ada readings

---

#### 4. Get Statistics

**GET** `/sensors/statistics?machineId=uuid&hours=24`

Mendapatkan aggregated statistics untuk sensor readings.

**Query Parameters:**
- `machineId` (uuid, required): Machine UUID
- `hours` (integer, optional): Time window in hours. Default: `24`

**Response:** `200 OK`
```json
{
  "count": 48,
  "airTemp": {
    "min": 296.5,
    "max": 301.2,
    "avg": 298.75
  },
  "processTemp": {
    "min": 306.5,
    "max": 311.2,
    "avg": 308.75
  },
  "rotationalSpeed": {
    "min": 2750,
    "max": 2950,
    "avg": 2850
  },
  "torque": {
    "min": 35.2,
    "max": 48.7,
    "avg": 42.3
  },
  "toolWear": {
    "min": 100,
    "max": 200,
    "avg": 150
  }
}
```

**Error Responses:**
- `400 Bad Request` - machineId required
- `404 Not Found` - Machine tidak ditemukan
- `404 Not Found` - No readings in time window

---

## 🔌 Realtime Features

### WebSocket Connection

Connect ke WebSocket untuk realtime sensor updates:

```javascript
const socket = io('http://localhost:3000/sensors');

// Listen for new sensor readings
socket.on('sensorReading', (data) => {
  console.log('New reading:', data);
});

// Connection events
socket.on('connect', () => {
  console.log('Connected to sensor stream');
});
```

### Supabase Realtime

Server juga subscribe ke Supabase Realtime untuk database changes:

```typescript
// Automatic subscription to sensor_readings table
// Broadcasts INSERT events via WebSocket
```

### Test Realtime

1. Start server: `npm run start:dev`
2. Open `test/websocket-client.html` di browser
3. Run simulator: `npm run simulate:sensors`
4. Watch live updates di browser

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Manual Testing dengan cURL

**Create Machine:**
```bash
curl -X POST http://localhost:3000/machines \
  -H "Content-Type: application/json" \
  -d '{"productId":"M24000","type":"M"}'
```

**Create Sensor Reading:**
```bash
curl -X POST http://localhost:3000/sensors/readings \
  -H "Content-Type: application/json" \
  -d '{
    "productId":"M23839",
    "airTemp":298.5,
    "processTemp":308.2,
    "rotationalSpeed":2850,
    "torque":42.5,
    "toolWear":150
  }'
```

**Get Statistics:**
```bash
curl "http://localhost:3000/sensors/statistics?machineId=uuid-here&hours=24"
```

---

## 📁 Project Structure

```
predictive-maintenance-copilot-backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   ├── simulate-realtime.ts   # Sensor data simulator
│   └── migrations/            # Database migrations
├── src/
│   ├── main.ts               # Application entry point
│   ├── app.module.ts         # Root module
│   ├── machines/             # Machines module
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── machines.controller.ts
│   │   ├── machines.service.ts
│   │   └── machines.module.ts
│   ├── sensors/              # Sensors module
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── sensors.controller.ts
│   │   ├── sensors.service.ts
│   │   ├── sensors-realtime.gateway.ts
│   │   ├── supabase-realtime.service.ts
│   │   └── sensors.module.ts
│   └── prisma/               # Prisma module
│       ├── prisma.service.ts
│       └── prisma.module.ts
├── test/                     # E2E tests
├── .env                      # Environment variables
├── package.json
└── README.md
```

---

## 🔧 Database Schema

### Machine Table

```prisma
model Machine {
  id             String         @id @default(dbgenerated("gen_random_uuid()"))
  productId      String         @unique
  type           String         // L, M, H
  sensorReadings SensorData[]
  
  @@map("machines")
}
```

### SensorData Table

```prisma
model SensorData {
  udi             Int       @id @default(autoincrement())
  machineId       String    
  machine         Machine   @relation(fields: [machineId], references: [id])
  timestamp       DateTime  @default(now())
  airTemp         Float
  processTemp     Float
  rotationalSpeed Int
  torque          Float
  toolWear        Int
  
  @@index([machineId, timestamp])
  @@map("sensor_readings")
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the UNLICENSED License.

---

## 👤 Author

**papermintx**
- GitHub: [@papermintx](https://github.com/papermintx)

---

## 🙏 Acknowledgments

- NestJS Framework
- Prisma ORM
- Supabase
- Dataset: [Predictive Maintenance Dataset](https://www.kaggle.com/datasets/stephanmatzka/predictive-maintenance-dataset-ai4i-2020)

---

**Happy Coding! 🚀**
