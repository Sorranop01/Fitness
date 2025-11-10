import { collection, getDocs, getDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Class } from '@/types';

/**
 * Get all classes
 */
export async function getClasses(): Promise<Class[]> {
  const classesRef = collection(db, 'classes');
  const q = query(classesRef, orderBy('startTime', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      instructor: data.instructor,
      locationId: data.locationId,
      startTime: (data.startTime as Timestamp).toDate(),
      endTime: (data.endTime as Timestamp).toDate(),
      capacity: data.capacity,
      bookedCount: data.bookedCount || 0,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Get upcoming classes (future classes only)
 */
export async function getUpcomingClasses(): Promise<Class[]> {
  const classesRef = collection(db, 'classes');
  const now = Timestamp.now();
  const q = query(
    classesRef,
    where('startTime', '>', now),
    orderBy('startTime', 'asc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      instructor: data.instructor,
      locationId: data.locationId,
      startTime: (data.startTime as Timestamp).toDate(),
      endTime: (data.endTime as Timestamp).toDate(),
      capacity: data.capacity,
      bookedCount: data.bookedCount || 0,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Get class by ID
 */
export async function getClassById(classId: string): Promise<Class | null> {
  const classDoc = await getDoc(doc(db, 'classes', classId));

  if (!classDoc.exists()) {
    return null;
  }

  const data = classDoc.data();
  return {
    id: classDoc.id,
    name: data.name,
    description: data.description,
    instructor: data.instructor,
    locationId: data.locationId,
    startTime: (data.startTime as Timestamp).toDate(),
    endTime: (data.endTime as Timestamp).toDate(),
    capacity: data.capacity,
    bookedCount: data.bookedCount || 0,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };
}
