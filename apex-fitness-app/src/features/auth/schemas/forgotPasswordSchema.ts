import { z } from 'zod';

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
