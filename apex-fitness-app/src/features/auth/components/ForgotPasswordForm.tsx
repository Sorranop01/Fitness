import { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/forgotPasswordSchema';
import { Button } from '@/components/ui/Button';

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({});
  const [emailSent, setEmailSent] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = forgotPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ForgotPasswordFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ForgotPasswordFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // Submit form
    forgotPasswordMutation.mutate(result.data.email, {
      onSuccess: () => {
        setEmailSent(true);
      },
    });
  };

  const handleChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ส่งอีเมลสำเร็จ
          </h2>
          <p className="text-gray-600 mb-6">
            เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปที่ <strong>{formData.email}</strong> แล้ว
            กรุณาตรวจสอบอีเมลของคุณ
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={onBackToLogin}
            className="w-full"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        ลืมรหัสผ่าน?
      </h2>
      <p className="text-gray-600 text-center mb-6">
        กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้คุณ
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={forgotPasswordMutation.isPending}
        >
          ส่งลิงก์รีเซ็ตรหัสผ่าน
        </Button>

        {/* Back to Login Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            ← กลับไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </form>
    </div>
  );
}
