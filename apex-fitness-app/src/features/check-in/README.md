# Check-in Feature

จัดการการเช็คอินเข้าใช้งานคลาสและซาวน่า

## โครงสร้าง

```
check-in/
├── api/
│   └── checkInApi.ts           # Firestore operations for check-ins
├── components/
│   ├── CheckInButton.tsx       # ปุ่มเช็คอินพร้อม validation
│   ├── CheckInCard.tsx         # การ์ดแสดงการจองที่สามารถเช็คอินได้
│   ├── CheckInHistory.tsx      # ประวัติการเช็คอิน
│   └── CheckInStats.tsx        # สถิติการเช็คอิน
├── hooks/
│   ├── useCheckIn.ts           # Hook สำหรับเช็คอิน
│   ├── useValidateCheckIn.ts   # Hook สำหรับตรวจสอบความถูกต้อง
│   ├── useTodayCheckIns.ts     # Hook สำหรับดึงการจองวันนี้
│   ├── useCheckInHistory.ts    # Hook สำหรับดึงประวัติ
│   └── useCheckInStats.ts      # Hook สำหรับดึงสถิติ
├── index.ts                    # Export ทั้งหมด
└── README.md                   # Documentation นี้
```

## ระบบ Check-in

### เวลาที่สามารถเช็คอินได้

- ✅ **ก่อนคลาสเริ่ม**: 30 นาที
- ✅ **หลังคลาสเริ่ม**: 15 นาที
- ❌ **เกินกำหนด**: ไม่สามารถเช็คอินได้

### กฎการเช็คอิน

1. ต้องมีการจองที่ยืนยันแล้ว (status = 'confirmed')
2. ต้องอยู่ในช่วงเวลาที่กำหนด
3. เช็คอินได้เพียงครั้งเดียวต่อการจอง
4. การจองที่ถูกยกเลิกไม่สามารถเช็คอินได้

## การใช้งาน

### 1. เช็คอินในหน้า Check-in Page

```tsx
import { CheckInPage } from '@/pages/CheckInPage';

// CheckInPage จะแสดง:
// - การจองวันนี้ที่สามารถเช็คอินได้
// - ประวัติการเช็คอิน
// - สถิติการเช็คอิน
```

### 2. ใช้ CheckInButton Component

```tsx
import { CheckInButton } from '@/features/check-in';

function MyComponent({ booking }: { booking: Booking }) {
  return (
    <CheckInButton
      booking={booking}
      onSuccess={() => {
        console.log('เช็คอินสำเร็จ!');
      }}
    />
  );
}
```

### 3. ใช้ Hook สำหรับเช็คอิน

```tsx
import { useCheckIn, useValidateCheckIn } from '@/features/check-in';

function CheckInExample({ bookingId, userId }: {
  bookingId: string;
  userId: string;
}) {
  const checkInMutation = useCheckIn();
  const { data: validation } = useValidateCheckIn(bookingId);

  const handleCheckIn = async () => {
    if (!validation?.canCheckIn) {
      alert(validation?.reason);
      return;
    }

    try {
      await checkInMutation.mutateAsync({ bookingId, userId });
      alert('เช็คอินสำเร็จ!');
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <button
      onClick={handleCheckIn}
      disabled={!validation?.canCheckIn || checkInMutation.isPending}
    >
      เช็คอิน
    </button>
  );
}
```

### 4. แสดงการจองวันนี้ที่สามารถเช็คอินได้

```tsx
import { useTodayCheckIns, CheckInCard } from '@/features/check-in';

function TodayCheckIns({ userId }: { userId: string }) {
  const { data: bookings, isLoading } = useTodayCheckIns(userId);

  if (isLoading) return <div>กำลังโหลด...</div>;

  return (
    <div>
      {bookings?.map((booking) => (
        <CheckInCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
```

### 5. แสดงประวัติการเช็คอิน

```tsx
import { CheckInHistory } from '@/features/check-in';

function HistoryPage({ userId }: { userId: string }) {
  return <CheckInHistory userId={userId} limit={50} />;
}
```

### 6. แสดงสถิติการเช็คอิน

```tsx
import { CheckInStats } from '@/features/check-in';

function StatsPage({ userId }: { userId: string }) {
  return <CheckInStats userId={userId} />;
}
```

## API Functions

### Check-in Operations

- `validateCheckIn(bookingId: string)` - ตรวจสอบว่าสามารถเช็คอินได้หรือไม่
- `checkIn(bookingId: string, userId: string)` - เช็คอินเข้าคลาส (ใช้ Transaction)
- `getTodayCheckInEligibleBookings(userId: string)` - ดึงการจองวันนี้
- `getCheckInHistory(userId: string, limit: number)` - ดึงประวัติการเช็คอิน
- `getCheckInStats(userId: string)` - ดึงสถิติการเช็คอิน

### Validation Result

```typescript
interface CheckInValidation {
  canCheckIn: boolean;
  reason?: string;
  booking?: Booking;
  timeUntilCheckIn?: number; // minutes until check-in window opens
}
```

### Check-in Result

```typescript
interface CheckInResult {
  success: boolean;
  booking: Booking;
  checkedInAt: Date;
}
```

## Check-in Flow

```
1. User เข้าหน้า Check-in
   ↓
2. ระบบแสดงการจองวันนี้
   ↓
3. User กดปุ่ม "เช็คอิน"
   ↓
4. ระบบตรวจสอบ (validateCheckIn)
   - มีการจองหรือไม่?
   - อยู่ในช่วงเวลาหรือไม่?
   - เช็คอินแล้วหรือยัง?
   ↓
5. ถ้า OK → แสดงหน้ายืนยัน
   ↓
6. User กด "ยืนยัน"
   ↓
7. ระบบเช็คอิน (checkIn)
   - อัพเดท checkedInAt
   - เปลี่ยน status เป็น 'completed'
   ↓
8. แสดงผลสำเร็จ
```

## การตั้งค่าเวลา

คุณสามารถปรับเปลี่ยนเวลา check-in window ได้ที่:

**apex-fitness-app/src/features/check-in/api/checkInApi.ts:14-17**

```typescript
const CHECK_IN_WINDOW = {
  BEFORE_START_MINUTES: 30, // สามารถเช็คอินได้ก่อนคลาสเริ่ม 30 นาที
  AFTER_START_MINUTES: 15,  // สามารถเช็คอินได้หลังคลาสเริ่มไปแล้ว 15 นาที
};
```

## ข้อควรระวัง

1. **Transaction Safety**: ฟังก์ชัน `checkIn` ใช้ Firestore Transaction เพื่อป้องกัน race condition
2. **Time Validation**: ระบบจะตรวจสอบเวลาอัตโนมัติก่อนเช็คอินทุกครั้ง
3. **User Authorization**: ตรวจสอบว่า user เป็นเจ้าของการจองหรือไม่
4. **Status Update**: การเช็คอินจะเปลี่ยนสถานะเป็น 'completed' อัตโนมัติ
5. **Query Invalidation**: Hook จะ invalidate queries ที่เกี่ยวข้องอัตโนมัติ

## Best Practices

1. ใช้ `@/` alias สำหรับ imports
2. ใช้ TanStack Query hooks เสมอ (ห้ามใช้ useState + useEffect)
3. ใช้ `type="button"` สำหรับปุ่มที่ไม่ได้ submit form
4. ใช้ unique `key` (booking.id) สำหรับ lists
5. Handle loading และ error states ให้ครบถ้วน
6. ตรวจสอบ validation ก่อนเช็คอินเสมอ

## สถิติที่แสดง

- **Total Check-ins**: จำนวนการเช็คอินทั้งหมด
- **This Month**: จำนวนการเช็คอินในเดือนนี้
- **This Week**: จำนวนการเช็คอินในสัปดาห์นี้

## ฟีเจอร์เพิ่มเติม (Optional)

1. **QR Code Check-in** - สแกน QR code เพื่อเช็คอินอย่างรวดเร็ว
2. **Check-in Notifications** - แจ้งเตือนเมื่อถึงเวลาเช็คอิน
3. **Location Check** - ตรวจสอบตำแหน่งว่าอยู่ที่สาขาจริงหรือไม่
4. **Streak Tracking** - ติดตามการเข้าคลาสติดต่อกัน
5. **Rewards System** - ให้คะแนนหรือของรางวัลสำหรับการเช็คอินสม่ำเสมอ
