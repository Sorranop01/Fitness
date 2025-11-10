import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from '@/features/auth/hooks/useChangePassword';
import { changePasswordSchema, type ChangePasswordFormData } from '@/features/auth/schemas/changePasswordSchema';
import { Button } from '@/components/ui/Button';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const changePasswordMutation = useChangePassword();

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = changePasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ChangePasswordFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ChangePasswordFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // Submit form
    const { confirmPassword, ...changeData } = result.data;
    changePasswordMutation.mutate(changeData, {
      onSuccess: () => {
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        // Navigate back to profile after 1 second
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      },
    });
  };

  const handleChange = (field: keyof ChangePasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไปหน้าโปรไฟล์
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">เปลี่ยนรหัสผ่าน</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านปัจจุบัน
            </label>
            <input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านใหม่
            </label>
            <input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              ยืนยันรหัสผ่านใหม่
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

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">คำแนะนำด้านความปลอดภัย</h3>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร</li>
                  <li>ใช้ตัวอักษรพิมพ์ใหญ่-เล็ก ตัวเลข และสัญลักษณ์ผสมกัน</li>
                  <li>หลีกเลี่ยงการใช้ข้อมูลส่วนตัว เช่น วันเกิด หรือชื่อ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={changePasswordMutation.isPending}
            >
              เปลี่ยนรหัสผ่าน
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile')}
              disabled={changePasswordMutation.isPending}
            >
              ยกเลิก
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
