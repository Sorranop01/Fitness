import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Booking } from '@/types';

// ==========================================
// Check-in Time Window Configuration
// ==========================================
const CHECK_IN_WINDOW = {
  BEFORE_START_MINUTES: 30, // สามารถเช็คอินได้ก่อนคลาสเริ่ม 30 นาที
  AFTER_START_MINUTES: 15,  // สามารถเช็คอินได้หลังคลาสเริ่มไปแล้ว 15 นาที
};

// ==========================================
// Types
// ==========================================
export interface CheckInResult {
  success: boolean;
  booking: Booking;
  checkedInAt: Date;
}

export interface CheckInValidation {
  canCheckIn: boolean;
  reason?: string;
  booking?: Booking;
  timeUntilCheckIn?: number; // minutes until check-in window opens
}

// ==========================================
// Check-in Functions
// ==========================================

/**
 * Validate if user can check-in to a booking
 */
export async function validateCheckIn(bookingId: string): Promise<CheckInValidation> {
  const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));

  if (!bookingDoc.exists()) {
    return {
      canCheckIn: false,
      reason: 'ไม่พบการจองนี้',
    };
  }

  const data = bookingDoc.data();
  const booking: Booking = {
    id: bookingDoc.id,
    userId: data.userId,
    type: data.type,
    classId: data.classId,
    locationId: data.locationId,
    startTime: (data.startTime as Timestamp).toDate(),
    endTime: (data.endTime as Timestamp).toDate(),
    status: data.status,
    checkedInAt: data.checkedInAt ? (data.checkedInAt as Timestamp).toDate() : undefined,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };

  // Check if already checked in
  if (booking.checkedInAt) {
    return {
      canCheckIn: false,
      reason: 'คุณได้เช็คอินแล้ว',
      booking,
    };
  }

  // Check if booking is cancelled
  if (booking.status === 'cancelled') {
    return {
      canCheckIn: false,
      reason: 'การจองนี้ถูกยกเลิกแล้ว',
      booking,
    };
  }

  // Check time window
  const now = new Date();
  const startTime = booking.startTime;
  const checkInWindowStart = new Date(
    startTime.getTime() - CHECK_IN_WINDOW.BEFORE_START_MINUTES * 60 * 1000
  );
  const checkInWindowEnd = new Date(
    startTime.getTime() + CHECK_IN_WINDOW.AFTER_START_MINUTES * 60 * 1000
  );

  // Too early
  if (now < checkInWindowStart) {
    const minutesUntil = Math.ceil((checkInWindowStart.getTime() - now.getTime()) / (60 * 1000));
    return {
      canCheckIn: false,
      reason: `ยังเช็คอินไม่ได้ กรุณารออีก ${minutesUntil} นาที`,
      booking,
      timeUntilCheckIn: minutesUntil,
    };
  }

  // Too late
  if (now > checkInWindowEnd) {
    return {
      canCheckIn: false,
      reason: 'หมดเวลาเช็คอินแล้ว (สามารถเช็คอินได้ภายใน 15 นาทีหลังคลาสเริ่ม)',
      booking,
    };
  }

  // Can check in
  return {
    canCheckIn: true,
    booking,
  };
}

/**
 * Check-in to a booking
 */
export async function checkIn(bookingId: string, userId: string): Promise<CheckInResult> {
  // Validate first
  const validation = await validateCheckIn(bookingId);

  if (!validation.canCheckIn) {
    throw new Error(validation.reason || 'ไม่สามารถเช็คอินได้');
  }

  if (!validation.booking) {
    throw new Error('ไม่พบข้อมูลการจอง');
  }

  // Verify user owns this booking
  if (validation.booking.userId !== userId) {
    throw new Error('คุณไม่มีสิทธิ์เช็คอินการจองนี้');
  }

  const checkedInAt = new Date();

  // Use transaction to update booking
  await runTransaction(db, async (transaction) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingDoc = await transaction.get(bookingRef);

    if (!bookingDoc.exists()) {
      throw new Error('ไม่พบการจองนี้');
    }

    const data = bookingDoc.data();

    // Double check not already checked in (in case of race condition)
    if (data.checkedInAt) {
      throw new Error('คุณได้เช็คอินแล้ว');
    }

    // Update booking with check-in time
    transaction.update(bookingRef, {
      checkedInAt: Timestamp.fromDate(checkedInAt),
      status: 'completed',
      updatedAt: Timestamp.now(),
    });
  });

  return {
    success: true,
    booking: {
      ...validation.booking,
      checkedInAt,
      status: 'completed',
    },
    checkedInAt,
  };
}

/**
 * Get today's bookings that are eligible for check-in
 */
export async function getTodayCheckInEligibleBookings(userId: string): Promise<Booking[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    where('status', '==', 'confirmed'),
    where('startTime', '>=', Timestamp.fromDate(today)),
    where('startTime', '<', Timestamp.fromDate(tomorrow)),
    orderBy('startTime', 'asc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      type: data.type,
      classId: data.classId,
      locationId: data.locationId,
      startTime: (data.startTime as Timestamp).toDate(),
      endTime: (data.endTime as Timestamp).toDate(),
      status: data.status,
      checkedInAt: data.checkedInAt ? (data.checkedInAt as Timestamp).toDate() : undefined,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  });
}

/**
 * Get check-in history for a user
 */
export async function getCheckInHistory(userId: string, limitCount = 20): Promise<Booking[]> {
  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    where('status', '==', 'completed'),
    orderBy('checkedInAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      type: data.type,
      classId: data.classId,
      locationId: data.locationId,
      startTime: (data.startTime as Timestamp).toDate(),
      endTime: (data.endTime as Timestamp).toDate(),
      status: data.status,
      checkedInAt: data.checkedInAt ? (data.checkedInAt as Timestamp).toDate() : undefined,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  });
}

/**
 * Get check-in statistics for a user
 */
export async function getCheckInStats(userId: string): Promise<{
  totalCheckIns: number;
  thisMonth: number;
  thisWeek: number;
}> {
  const bookingsRef = collection(db, 'bookings');

  // Get all completed bookings
  const allQuery = query(
    bookingsRef,
    where('userId', '==', userId),
    where('status', '==', 'completed')
  );
  const allSnapshot = await getDocs(allQuery);
  const totalCheckIns = allSnapshot.size;

  // Get this month's bookings
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthQuery = query(
    bookingsRef,
    where('userId', '==', userId),
    where('status', '==', 'completed'),
    where('checkedInAt', '>=', Timestamp.fromDate(monthStart))
  );
  const monthSnapshot = await getDocs(monthQuery);
  const thisMonth = monthSnapshot.size;

  // Get this week's bookings
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekQuery = query(
    bookingsRef,
    where('userId', '==', userId),
    where('status', '==', 'completed'),
    where('checkedInAt', '>=', Timestamp.fromDate(weekStart))
  );
  const weekSnapshot = await getDocs(weekQuery);
  const thisWeek = weekSnapshot.size;

  return {
    totalCheckIns,
    thisMonth,
    thisWeek,
  };
}
