# Seed Data Script

สคริปต์สำหรับเพิ่มข้อมูลตัวอย่างลงใน Firestore

## การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
pnpm add -D firebase-admin tsx
```

### 2. ดาวน์โหลด Service Account Key

1. ไปที่ [Firebase Console](https://console.firebase.google.com)
2. เลือกโปรเจกต์ของคุณ
3. ไปที่ **Project Settings** > **Service Accounts**
4. คลิก **Generate New Private Key**
5. บันทึกไฟล์เป็น `scripts/serviceAccountKey.json`

⚠️ **สำคัญ:** เพิ่ม `serviceAccountKey.json` ลงใน `.gitignore`

```bash
# Add to .gitignore
scripts/serviceAccountKey.json
```

## การใช้งาน

### รัน Seed Script

```bash
npx tsx scripts/seedData.ts
```

## ข้อมูลที่จะถูกเพิ่ม

### 📍 Locations (3 สาขา)

- สาขา สุขุมวิท
- สาขา สีลม
- สาขา ทองหล่อ

### 💪 Classes (8 ประเภท x 4 สัปดาห์ = 32 คลาส)

1. **Yoga Morning Flow** - โยคะยามเช้า
2. **HIIT Cardio Blast** - การ์ดิโอความเข้มข้นสูง
3. **Pilates Core Strength** - พิลาทิสเพื่อแกนกลาง
4. **Zumba Dance Fitness** - ซุมบ้าเต้นสนุก
5. **Strength Training** - เทรนนิ่งความแข็งแรง
6. **Spin Cycle** - ปั่นจักรยาน
7. **Stretch & Recovery** - ยืดเหยียดและฟื้นฟู
8. **Boxing Bootcamp** - ชกมวยบูตแคมป์

## ตัวอย่างข้อมูล

### Location Document

```typescript
{
  id: 'bangkok-sukhumvit',
  name: 'สาขา สุขุมวิท',
  address: '123 ถนนสุขุมวิท...',
  saunaCapacity: 4,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Class Document

```typescript
{
  name: 'Yoga Morning Flow',
  description: 'เริ่มต้นวันใหม่...',
  instructor: 'อาจารย์ณัฐชา',
  locationId: 'bangkok-sukhumvit',
  startTime: Timestamp,
  endTime: Timestamp,
  capacity: 20,
  bookedCount: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## การปรับแต่ง

### เพิ่มสาขาใหม่

แก้ไข array `LOCATIONS` ใน `seedData.ts`:

```typescript
const LOCATIONS = [
  {
    id: 'your-branch-id',
    name: 'สาขา ชื่อของคุณ',
    address: 'ที่อยู่',
    saunaCapacity: 4,
  },
  // ...existing locations
];
```

### เพิ่มคลาสใหม่

แก้ไข array `CLASSES` ใน `seedData.ts`:

```typescript
const CLASSES = [
  {
    name: 'Your Class Name',
    description: 'รายละเอียด',
    instructor: 'ชื่อโค้ช',
    locationId: 'bangkok-sukhumvit',
    capacity: 20,
    duration: 60, // minutes
    classTime: {
      dayOfWeek: 1, // 0=Sunday, 1=Monday, ...
      startHour: 7,
      startMinute: 0,
    },
  },
  // ...existing classes
];
```

## การล้างข้อมูล

หากต้องการลบข้อมูลทั้งหมดและเริ่มใหม่:

1. ไปที่ Firebase Console
2. เลือก Firestore Database
3. ลบ Collections: `locations`, `classes`
4. รัน seed script ใหม่

## Troubleshooting

### Error: "Cannot find module './serviceAccountKey.json'"

**วิธีแก้:**
- ตรวจสอบว่าดาวน์โหลด Service Account Key แล้ว
- บันทึกไฟล์ที่ `scripts/serviceAccountKey.json`

### Error: "Permission denied"

**วิธีแก้:**
- ตรวจสอบว่า Service Account มีสิทธิ์เขียน Firestore
- ตรวจสอบ Firestore Security Rules

### Classes ไม่แสดงในแอพ

**วิธีแก้:**
- ตรวจสอบว่า `startTime` เป็นอนาคต (ไม่ใช่อดีต)
- ตรวจสอบ Firestore index สำหรับ `startTime`

## Next Steps

หลังจากรัน seed script:

1. ✅ ลงทะเบียนผู้ใช้ใหม่ในแอพ
2. ✅ ลองจองคลาส
3. ✅ ทดสอบฟีเจอร์เช็คอิน
4. ✅ ดูสถิติและประวัติ

## Security

⚠️ **สำคัญมาก:**

- **อย่า** commit `serviceAccountKey.json` ลง git
- **อย่า** แชร์ Service Account Key กับคนอื่น
- ใช้ Environment Variables สำหรับ production
- ตั้งค่า Firestore Security Rules ให้เหมาะสม

## Production Deployment

สำหรับ production ควรใช้ Cloud Functions แทน:

```typescript
// functions/src/seeds/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import { seedLocations, seedClasses } from './seedData';

export const seed = onRequest(async (req, res) => {
  // Add authentication check
  if (req.headers.authorization !== `Bearer ${process.env.SEED_SECRET}`) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    await seedLocations();
    await seedClasses();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

**Happy Coding! 🚀**
