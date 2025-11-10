# Booking Feature

จัดการการจองคลาส และซาวน่า

## โครงสร้าง

```
booking/
├── api/
│   ├── bookingApi.ts        # Firestore operations for bookings
│   └── classApi.ts           # Firestore operations for classes
├── components/
│   ├── BookingCard.tsx       # แสดงข้อมูลการจองแต่ละรายการ
│   ├── BookingList.tsx       # แสดงรายการการจองทั้งหมด
│   ├── BookingForm.tsx       # ฟอร์มสำหรับการจอง
│   └── ClassCard.tsx         # แสดงข้อมูลคลาส
├── hooks/
│   ├── useBookings.ts        # Hook สำหรับดึงข้อมูลการจอง
│   ├── useBookingById.ts     # Hook สำหรับดึงข้อมูลการจองตาม ID
│   ├── useCreateBooking.ts   # Hook สำหรับสร้างการจอง
│   ├── useCancelBooking.ts   # Hook สำหรับยกเลิกการจอง
│   ├── useClasses.ts         # Hook สำหรับดึงข้อมูลคลาส
│   └── useClassById.ts       # Hook สำหรับดึงข้อมูลคลาสตาม ID
├── schemas/
│   └── bookingSchemas.ts     # Zod validation schemas
├── index.ts                  # Export ทั้งหมด
└── README.md                 # Documentation นี้
```

## การใช้งาน

### 1. แสดงรายการคลาสทั้งหมด

```tsx
import { useClasses, ClassCard } from '@/features/booking';

function ClassesPage() {
  const { data: classes, isLoading, error } = useClasses();

  if (isLoading) return <div>กำลังโหลด...</div>;
  if (error) return <div>เกิดข้อผิดพลาด</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes?.map((classData) => (
        <ClassCard key={classData.id} classData={classData} />
      ))}
    </div>
  );
}
```

### 2. แสดงรายการการจองของผู้ใช้

```tsx
import { BookingList } from '@/features/booking';
import { useAuth } from '@/features/auth';

function MyBookingsPage() {
  const { user } = useAuth();

  if (!user) return <div>กรุณาเข้าสู่ระบบ</div>;

  return (
    <div>
      <h1>การจองของฉัน</h1>
      {/* แสดงเฉพาะการจองที่กำลังจะมาถึง */}
      <BookingList userId={user.id} showOnlyUpcoming={true} />
    </div>
  );
}
```

### 3. สร้างการจองใหม่

```tsx
import { useState } from 'react';
import { BookingForm, useClassById } from '@/features/booking';
import { useAuth } from '@/features/auth';

function ClassDetailPage({ classId }: { classId: string }) {
  const { user } = useAuth();
  const { data: classData } = useClassById(classId);
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (!classData) return null;

  return (
    <div>
      <h1>{classData.name}</h1>
      <p>{classData.description}</p>

      <button onClick={() => setShowBookingForm(true)}>
        จองเลย
      </button>

      {showBookingForm && user && (
        <BookingForm
          classData={classData}
          bookingType="class"
          locationId={classData.locationId}
          userId={user.id}
          onSuccess={() => {
            setShowBookingForm(false);
            alert('จองสำเร็จ!');
          }}
          onCancel={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}
```

### 4. ยกเลิกการจอง

```tsx
import { useCancelBooking } from '@/features/booking';

function CancelBookingButton({ bookingId, userId, classId }: {
  bookingId: string;
  userId: string;
  classId?: string;
}) {
  const cancelMutation = useCancelBooking();

  const handleCancel = async () => {
    if (!confirm('ยืนยันการยกเลิก?')) return;

    try {
      await cancelMutation.mutateAsync({
        bookingId,
        userId,
        classId,
      });
      alert('ยกเลิกสำเร็จ!');
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={cancelMutation.isPending}
    >
      {cancelMutation.isPending ? 'กำลังยกเลิก...' : 'ยกเลิกการจอง'}
    </button>
  );
}
```

### 5. ตรวจสอบว่ามีที่ว่างหรือไม่

```tsx
import { checkClassAvailability } from '@/features/booking';

async function checkAvailability(classId: string) {
  try {
    const { available, availableSlots } = await checkClassAvailability(classId);

    if (available) {
      console.log(`มีที่ว่างอีก ${availableSlots} ที่`);
    } else {
      console.log('คลาสเต็มแล้ว');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  }
}
```

## API Functions

### Booking API

- `getUserBookings(userId: string)` - ดึงข้อมูลการจองทั้งหมดของผู้ใช้
- `getUpcomingBookings(userId: string)` - ดึงข้อมูลการจองที่กำลังจะมาถึง
- `getBookingById(bookingId: string)` - ดึงข้อมูลการจองตาม ID
- `createBooking(input: CreateBookingInput)` - สร้างการจองใหม่ (ใช้ Transaction)
- `cancelBooking(bookingId: string)` - ยกเลิกการจอง (ใช้ Transaction)
- `checkClassAvailability(classId: string)` - ตรวจสอบที่ว่าง
- `hasExistingBooking(userId: string, classId: string)` - ตรวจสอบว่าจองแล้วหรือยัง

### Class API

- `getClasses()` - ดึงข้อมูลคลาสทั้งหมด
- `getUpcomingClasses()` - ดึงข้อมูลคลาสที่กำลังจะมาถึง
- `getClassById(classId: string)` - ดึงข้อมูลคลาสตาม ID

## Validation Schemas

```tsx
import { createBookingSchema } from '@/features/booking';

// Validate booking input
const result = createBookingSchema.safeParse({
  userId: 'user123',
  type: 'class',
  classId: 'class123',
  locationId: 'location123',
  startTime: new Date('2025-12-01T10:00:00'),
  endTime: new Date('2025-12-01T11:00:00'),
});

if (!result.success) {
  console.error(result.error.errors);
}
```

## ข้อควรระวัง

1. **Transaction Safety**: ฟังก์ชัน `createBooking` และ `cancelBooking` ใช้ Firestore Transaction เพื่อป้องกันปัญหา race condition
2. **Capacity Check**: ระบบจะตรวจสอบจำนวนที่ว่างก่อนสร้างการจอง
3. **Query Invalidation**: Hook mutations จะ invalidate queries ที่เกี่ยวข้องอัตโนมัติ
4. **TypeScript**: ใช้ types จาก `@/types` และ avoid `any` ทั้งหมด
5. **Error Handling**: ควร handle errors ด้วย try-catch เสมอ

## Best Practices

1. ใช้ `@/` alias สำหรับ imports
2. ใช้ TanStack Query hooks เสมอ (ห้ามใช้ useState + useEffect)
3. ใช้ `type="button"` สำหรับปุ่มที่ไม่ได้ submit form
4. ใช้ unique `key` (booking.id) สำหรับ lists
5. Handle loading และ error states ให้ครบถ้วน
