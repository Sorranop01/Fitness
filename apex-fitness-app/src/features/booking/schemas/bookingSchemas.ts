import { z } from 'zod';

// ==========================================
// Booking Type Schema
// ==========================================
export const bookingTypeSchema = z.enum(['class', 'sauna'], {
  errorMap: () => ({ message: 'ประเภทการจองไม่ถูกต้อง' }),
});

// ==========================================
// Create Booking Schema
// ==========================================
export const createBookingSchema = z
  .object({
    userId: z.string().min(1, 'ต้องระบุ User ID'),
    type: bookingTypeSchema,
    classId: z.string().optional(),
    locationId: z.string().min(1, 'ต้องระบุสาขา'),
    startTime: z.date({
      required_error: 'ต้องระบุเวลาเริ่มต้น',
      invalid_type_error: 'เวลาเริ่มต้นไม่ถูกต้อง',
    }),
    endTime: z.date({
      required_error: 'ต้องระบุเวลาสิ้นสุด',
      invalid_type_error: 'เวลาสิ้นสุดไม่ถูกต้อง',
    }),
  })
  .refine(
    (data) => {
      // If booking type is 'class', classId is required
      if (data.type === 'class') {
        return !!data.classId && data.classId.length > 0;
      }
      return true;
    },
    {
      message: 'ต้องระบุ Class ID สำหรับการจองคลาส',
      path: ['classId'],
    }
  )
  .refine(
    (data) => {
      // End time must be after start time
      return data.endTime > data.startTime;
    },
    {
      message: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น',
      path: ['endTime'],
    }
  )
  .refine(
    (data) => {
      // Start time must be in the future
      return data.startTime > new Date();
    },
    {
      message: 'ไม่สามารถจองย้อนหลังได้',
      path: ['startTime'],
    }
  );

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ==========================================
// Cancel Booking Schema
// ==========================================
export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, 'ต้องระบุ Booking ID'),
  userId: z.string().min(1, 'ต้องระบุ User ID'),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

// ==========================================
// Sauna Booking Schema (Extended)
// ==========================================
export const saunaBookingSchema = z.object({
  userId: z.string().min(1, 'ต้องระบุ User ID'),
  type: z.literal('sauna'),
  locationId: z.string().min(1, 'ต้องระบุสาขา'),
  startTime: z.date({
    required_error: 'ต้องระบุเวลาเริ่มต้น',
    invalid_type_error: 'เวลาเริ่มต้นไม่ถูกต้อง',
  }),
  endTime: z.date({
    required_error: 'ต้องระบุเวลาสิ้นสุด',
    invalid_type_error: 'เวลาสิ้นสุดไม่ถูกต้อง',
  }),
  duration: z.number().min(30, 'ระยะเวลาต้องไม่น้อยกว่า 30 นาที').max(120, 'ระยะเวลาต้องไม่เกิน 120 นาที'),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น',
    path: ['endTime'],
  }
).refine(
  (data) => data.startTime > new Date(),
  {
    message: 'ไม่สามารถจองย้อนหลังได้',
    path: ['startTime'],
  }
);

export type SaunaBookingInput = z.infer<typeof saunaBookingSchema>;
