import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export function LoginForm({ onSuccess, onRegisterClick, onForgotPasswordClick }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // Submit form
    loginMutation.mutate(result.data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        เข้าสู่ระบบ
      </h2>

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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              รหัสผ่าน
            </label>
            {onForgotPasswordClick && (
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ลืมรหัสผ่าน?
              </button>
            )}
          </div>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          เข้าสู่ระบบ
        </Button>

        {/* Register Link */}
        <div className="text-center mt-4">
          <span className="text-gray-600">ยังไม่มีบัญชี? </span>
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            สมัครสมาชิก
          </button>
        </div>
      </form>
    </div>
  );
}
