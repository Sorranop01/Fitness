// ==========================================
// User Types
// ==========================================
export type UserRole = 'member' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Class Types
// ==========================================
export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  bookedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Booking Types
// ==========================================
export type BookingType = 'class' | 'sauna';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  type: BookingType;
  classId?: string; // For class bookings
  locationId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Location Types
// ==========================================
export interface Location {
  id: string;
  name: string;
  address: string;
  saunaCapacity: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Sauna Types
// ==========================================
export interface SaunaSlot {
  id: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  bookedCount: number;
}

// ==========================================
// Helper Types
// ==========================================

// Booking with populated class data
export interface BookingWithClass extends Booking {
  class?: Class;
}

// Booking with populated location data
export interface BookingWithLocation extends Booking {
  location?: Location;
}

// Partial types for updates
export type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;
export type ClassUpdate = Partial<Omit<Class, 'id' | 'createdAt'>>;
export type BookingUpdate = Partial<Omit<Booking, 'id' | 'userId' | 'createdAt'>>;

// ==========================================
// API Response Types
// ==========================================
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
