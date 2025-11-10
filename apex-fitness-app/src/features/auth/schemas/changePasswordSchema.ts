import { z } from 'zod';

/**
 * Change password form validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
  newPassword: z
    .string()
    .min(1, 'กรุณากรอกรหัสผ่านใหม่')
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  confirmPassword: z
    .string()
    .min(1, 'กรุณายืนยันรหัสผ่านใหม่'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านปัจจุบัน',
  path: ['newPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
