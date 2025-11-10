import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';
import { Button } from '@/components/ui/Button';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // Submit form (exclude confirmPassword from API call)
    const { confirmPassword, ...registerData } = result.data;
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        สมัครสมาชิก
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Name Field */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ-นามสกุล
          </label>
          <input
            id="displayName"
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.displayName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="สมชาย ใจดี"
            autoComplete="name"
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
          )}
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            รหัสผ่าน
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            ยืนยันรหัสผ่าน
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={registerMutation.isPending}
        >
          สมัครสมาชิก
        </Button>

        {/* Login Link */}
        <div className="text-center mt-4">
          <span className="text-gray-600">มีบัญชีอยู่แล้ว? </span>
          <button
            type="button"
            onClick={onLoginClick}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </form>
    </div>
  );
}
