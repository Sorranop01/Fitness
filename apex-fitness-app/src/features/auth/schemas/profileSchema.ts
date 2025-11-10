import { z } from 'zod';

/**
 * Profile update form validation schema
 */
export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'กรุณากรอกชื่อ')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
