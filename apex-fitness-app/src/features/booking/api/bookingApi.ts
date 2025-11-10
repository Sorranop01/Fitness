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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Booking, BookingType, BookingStatus } from '@/types';

// ==========================================
// Types for API
// ==========================================
export interface CreateBookingInput {
  userId: string;
  type: BookingType;
  classId?: string; // Required for class bookings
  locationId: string;
  startTime: Date;
  endTime: Date;
}

// ==========================================
// Get Bookings
// ==========================================

/**
 * Get all bookings for a user
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    orderBy('startTime', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      type: data.type as BookingType,
      classId: data.classId,
      locationId: data.locationId,
      startTime: (data.startTime as Timestamp).toDate(),
      endTime: (data.endTime as Timestamp).toDate(),
      status: data.status as BookingStatus,
      checkedInAt: data.checkedInAt ? (data.checkedInAt as Timestamp).toDate() : undefined,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  });
}

/**
 * Get upcoming bookings for a user
 */
export async function getUpcomingBookings(userId: string): Promise<Booking[]> {
  const bookingsRef = collection(db, 'bookings');
  const now = Timestamp.now();
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    where('startTime', '>', now),
    where('status', '==', 'confirmed'),
    orderBy('startTime', 'asc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      type: data.type as BookingType,
      classId: data.classId,
      locationId: data.locationId,
      startTime: (data.startTime as Timestamp).toDate(),
      endTime: (data.endTime as Timestamp).toDate(),
      status: data.status as BookingStatus,
      checkedInAt: data.checkedInAt ? (data.checkedInAt as Timestamp).toDate() : undefined,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    };
  });
}

/**
 * Get booking by ID
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));

  if (!bookingDoc.exists()) {
    return null;
  }

  const data = bookingDoc.data();
  return {
    id: bookingDoc.id,
    userId: data.userId,
    type: data.type as BookingType,
    classId: data.classId,
    locationId: data.locationId,
    startTime: (data.startTime as Timestamp).toDate(),
    endTime: (data.endTime as Timestamp).toDate(),
    status: data.status as BookingStatus,
    checkedInAt: data.checkedInAt ? (data.checkedInAt as Timestamp).toDate() : undefined,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

// ==========================================
// Create Booking (with Transaction)
// ==========================================

/**
 * Create a new booking with availability check
 * Uses Firestore transaction to ensure data consistency
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const { userId, type, classId, locationId, startTime, endTime } = input;

  const result = await runTransaction(db, async (transaction) => {
    // For class bookings, check capacity
    if (type === 'class' && classId) {
      const classRef = doc(db, 'classes', classId);
      const classDoc = await transaction.get(classRef);

      if (!classDoc.exists()) {
        throw new Error('คลาสนี้ไม่พบในระบบ');
      }

      const classData = classDoc.data();
      const currentBooked = classData.bookedCount || 0;
      const capacity = classData.capacity;

      if (currentBooked >= capacity) {
        throw new Error('คลาสนี้เต็มแล้ว');
      }

      // Increment bookedCount
      transaction.update(classRef, {
        bookedCount: currentBooked + 1,
        updatedAt: Timestamp.now(),
      });
    }

    // For sauna bookings, check capacity (optional - if you want to enforce limits)
    if (type === 'sauna') {
      // You can add sauna-specific capacity checking here if needed
      // For now, we'll just create the booking
    }

    // Create booking document
    const bookingsRef = collection(db, 'bookings');
    const newBookingRef = doc(bookingsRef);

    const bookingData = {
      userId,
      type,
      classId: classId || null,
      locationId,
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
      status: 'confirmed' as BookingStatus,
      checkedInAt: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    transaction.set(newBookingRef, bookingData);

    return {
      id: newBookingRef.id,
      userId,
      type,
      classId,
      locationId,
      startTime,
      endTime,
      status: 'confirmed' as BookingStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return result;
}

// ==========================================
// Cancel Booking
// ==========================================

/**
 * Cancel a booking
 * Uses transaction to update booking status and decrement class bookedCount
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingDoc = await transaction.get(bookingRef);

    if (!bookingDoc.exists()) {
      throw new Error('ไม่พบการจองนี้');
    }

    const bookingData = bookingDoc.data();

    if (bookingData.status === 'cancelled') {
      throw new Error('การจองนี้ถูกยกเลิกแล้ว');
    }

    // Update booking status
    transaction.update(bookingRef, {
      status: 'cancelled' as BookingStatus,
      updatedAt: Timestamp.now(),
    });

    // If it's a class booking, decrement bookedCount
    if (bookingData.type === 'class' && bookingData.classId) {
      const classRef = doc(db, 'classes', bookingData.classId);
      const classDoc = await transaction.get(classRef);

      if (classDoc.exists()) {
        const classData = classDoc.data();
        const currentBooked = classData.bookedCount || 0;

        transaction.update(classRef, {
          bookedCount: Math.max(0, currentBooked - 1), // Ensure it doesn't go below 0
          updatedAt: Timestamp.now(),
        });
      }
    }
  });
}

// ==========================================
// Check Availability
// ==========================================

/**
 * Check if a class has available slots
 */
export async function checkClassAvailability(classId: string): Promise<{
  available: boolean;
  availableSlots: number;
}> {
  const classDoc = await getDoc(doc(db, 'classes', classId));

  if (!classDoc.exists()) {
    throw new Error('คลาสนี้ไม่พบในระบบ');
  }

  const data = classDoc.data();
  const bookedCount = data.bookedCount || 0;
  const capacity = data.capacity;
  const availableSlots = capacity - bookedCount;

  return {
    available: availableSlots > 0,
    availableSlots,
  };
}

/**
 * Check if user already has a booking for a specific class
 */
export async function hasExistingBooking(
  userId: string,
  classId: string
): Promise<boolean> {
  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('userId', '==', userId),
    where('classId', '==', classId),
    where('status', '==', 'confirmed')
  );
  const snapshot = await getDocs(q);

  return !snapshot.empty;
}
