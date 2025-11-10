import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z
    .string()
    .min(1, 'กรุณากรอกรหัสผ่าน')
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z
    .string()
    .min(1, 'กรุณากรอกรหัสผ่าน')
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  confirmPassword: z
    .string()
    .min(1, 'กรุณายืนยันรหัสผ่าน'),
  displayName: z
    .string()
    .min(1, 'กรุณากรอกชื่อ')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
