# 🧪 Testing Realtime Sensor Readings

Panduan lengkap untuk testing implementasi realtime sensor readings dengan Supabase dan WebSocket.

## 📋 Prerequisites

1. Pastikan Supabase Realtime sudah diaktifkan untuk tabel `sensor_readings`
2. Environment variables sudah dikonfigurasi di `.env`
3. Dependencies sudah terinstall: `npm install`

## 🚀 Step-by-Step Testing

### 1. Generate Prisma Client

```bash
npm run prisma:generate
```

### 2. Seed Database dengan Data Awal

```bash
npm run prisma:seed
```

Output yang diharapkan:
```
🌱 Starting database seeding...
🧹 Cleaning up existing data...
🏭 Creating machines...
✅ Created 3 machines
📊 Creating sensor readings...
📈 Inserted batch 1/6
📈 Inserted batch 2/6
...
✅ Created 300 sensor readings
```

### 3. Start NestJS Server

```bash
npm run start:dev
```

Output yang diharapkan:
```
🚀 Application is running on: http://localhost:3000
📊 Sensors endpoint: http://localhost:3000/sensors
🔌 WebSocket: ws://localhost:3000/sensors
```

### 4. Test REST API dengan Postman atau cURL

#### Get All Sensor Readings
```bash
curl http://localhost:3000/sensors/readings
```

#### Get Readings by Machine ID
Pertama, dapatkan machine ID dari database:
```bash
curl http://localhost:3000/sensors/readings | grep machineId
```

Kemudian query by machine ID:
```bash
curl "http://localhost:3000/sensors/readings?machineId=YOUR_MACHINE_ID&limit=10"
```

#### Get Latest Reading
```bash
curl "http://localhost:3000/sensors/readings/latest?machineId=YOUR_MACHINE_ID"
```

#### Get Statistics
```bash
curl "http://localhost:3000/sensors/statistics?machineId=YOUR_MACHINE_ID&hours=24"
```

#### Create New Sensor Reading (POST)
```bash
curl -X POST http://localhost:3000/sensors/readings \
  -H "Content-Type: application/json" \
  -d '{
    "machineId": "YOUR_MACHINE_ID",
    "airTemp": 298.5,
    "processTemp": 308.2,
    "rotationalSpeed": 1500,
    "torque": 42.8,
    "toolWear": 100
  }'
```

### 5. Test WebSocket Realtime (Browser)

1. Buka file `test/websocket-client.html` di browser
2. WebSocket akan otomatis connect ke `ws://localhost:3000/sensors`
3. Monitor akan menampilkan:
   - Status koneksi
   - Real-time sensor readings
   - Anomaly detection
   - Event log

### 6. Simulate Real-time Data Generation

Buka terminal baru dan jalankan:
```bash
npm run simulate:sensors
```

Output yang diharapkan:
```
🤖 Starting sensor data simulator...
📡 Found 3 machines:
   - CNC-001 (High)
   - CNC-002 (Medium)
   - CNC-003 (Low)

⏱️  Generating sensor readings every 5 seconds...

✅ Normal | CNC-001 | Temp: 304.2K | Speed: 2050 RPM | Torque: 45.3 Nm
✅ Normal | CNC-002 | Temp: 299.8K | Speed: 1480 RPM | Torque: 38.7 Nm
⚠️  ANOMALY | CNC-003 | Temp: 313.5K | Speed: 2500 RPM | Torque: 82.1 Nm
```

## 🧪 Testing Scenarios

### Scenario 1: Normal Operation
1. Start server: `npm run start:dev`
2. Open WebSocket client in browser
3. Run simulator: `npm run simulate:sensors`
4. Observe real-time updates in browser

### Scenario 2: Anomaly Detection
Simulator otomatis generate anomalies (10% chance):
- **High temperature**: Air temp > 310K
- **High speed**: RPM > 3000
- **High torque**: Torque > 70 Nm
- WebSocket akan emit event `sensor-anomaly`

### Scenario 3: Manual Insert via API
```bash
# Insert reading dengan anomaly values
curl -X POST http://localhost:3000/sensors/readings \
  -H "Content-Type: application/json" \
  -d '{
    "machineId": "YOUR_MACHINE_ID",
    "airTemp": 320.5,
    "processTemp": 330.2,
    "rotationalSpeed": 3500,
    "torque": 85.8,
    "toolWear": 250
  }'
```

WebSocket client akan menampilkan ANOMALY badge.

### Scenario 4: Supabase Realtime Verification

1. Open Supabase SQL Editor
2. Insert data manually:
```sql
INSERT INTO public.sensor_readings (machine_id, air_temp, process_temp, rotational_speed, torque, tool_wear)
VALUES ('YOUR_MACHINE_ID', 298.5, 308.2, 1500, 42.8, 100);
```
3. WebSocket client harus otomatis menerima update

## 📊 Monitoring Tools

### Prisma Studio
```bash
npm run prisma:studio
```
Buka http://localhost:5555 untuk visual database browser

### WebSocket Testing dengan Postman
1. Create new WebSocket request
2. URL: `ws://localhost:3000/sensors`
3. Connect dan listen untuk events:
   - `connection`
   - `sensor-reading`
   - `sensor-anomaly`

## ⚠️ Troubleshooting

### WebSocket tidak connect
- Pastikan CORS enabled di `main.ts`
- Check port 3000 tidak digunakan aplikasi lain
- Verify `@nestjs/platform-socket.io` terinstall

### Supabase Realtime tidak berfungsi
- Pastikan table `sensor_readings` sudah di-enable di Supabase Dashboard
- Check `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `.env`
- Verify Supabase project tidak dalam sleep mode (free tier)

### Validation errors
- Pastikan Zod schema sesuai dengan Prisma schema
- Check data types (UUID, number ranges)

## 📝 Example Response Formats

### GET /sensors/readings
```json
{
  "success": true,
  "data": [
    {
      "udi": 1,
      "machineId": "uuid-here",
      "timestamp": "2025-10-29T10:30:00.000Z",
      "airTemp": 298.5,
      "processTemp": 308.2,
      "rotationalSpeed": 1500,
      "torque": 42.8,
      "toolWear": 100,
      "machine": {
        "id": "uuid-here",
        "name": "CNC-001",
        "type": "High"
      }
    }
  ],
  "count": 1
}
```

### WebSocket Event: sensor-reading
```json
{
  "event": "new-reading",
  "data": {
    "udi": 1,
    "machine_id": "uuid-here",
    "timestamp": "2025-10-29T10:30:00.000Z",
    "air_temp": 298.5,
    "process_temp": 308.2,
    "rotational_speed": 1500,
    "torque": 42.8,
    "tool_wear": 100
  },
  "timestamp": "2025-10-29T10:30:01.000Z"
}
```

### WebSocket Event: sensor-anomaly
```json
{
  "event": "anomaly-detected",
  "data": {
    "udi": 2,
    "machine_id": "uuid-here",
    "timestamp": "2025-10-29T10:35:00.000Z",
    "air_temp": 320.5,
    "process_temp": 330.2,
    "rotational_speed": 3500,
    "torque": 85.8,
    "tool_wear": 250,
    "anomalies": [
      "Air temperature too high: 320.5K (max: 310K)",
      "Process temperature too high: 330.2K (max: 320K)",
      "Rotational speed too high: 3500 RPM (max: 3000 RPM)",
      "Torque too high: 85.8 Nm (max: 70 Nm)",
      "Tool wear critical: 250 min (max: 200 min)"
    ]
  },
  "timestamp": "2025-10-29T10:35:01.000Z"
}
```

## 🎯 Next Steps

1. ✅ Seed database dengan data awal
2. ✅ Test REST API endpoints
3. ✅ Test WebSocket real-time
4. ✅ Run sensor simulator
5. ⏭️ Integrate dengan Machine Learning predictions
6. ⏭️ Integrate dengan LangChain AI Copilot
7. ⏭️ Build frontend dashboard

## 📚 Additional Resources

- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)
- [Zod Validation](https://zod.dev/)
