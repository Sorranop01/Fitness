import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';
import { useSendVerificationEmail } from '@/features/auth/hooks/useSendVerificationEmail';
import { Button } from '@/components/ui/Button';
import { profileSchema, type ProfileFormData } from '@/features/auth/schemas/profileSchema';
import { auth } from '@/lib/firebase';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const sendVerificationMutation = useSendVerificationEmail();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: user?.displayName || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  const isEmailVerified = auth.currentUser?.emailVerified || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = profileSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ProfileFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // Submit form
    updateProfileMutation.mutate(result.data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">โปรไฟล์ของฉัน</h1>

      {/* Profile Information Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">ข้อมูลส่วนตัว</h2>
          {!isEditing && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              แก้ไข
            </Button>
          )}
        </div>

        {isEditing ? (
          // Edit Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ-นามสกุล
              </label>
              <input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => {
                  setFormData({ ...formData, displayName: e.target.value });
                  if (errors.displayName) {
                    setErrors({ ...errors, displayName: undefined });
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.displayName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                variant="primary"
                isLoading={updateProfileMutation.isPending}
              >
                บันทึก
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              >
                ยกเลิก
              </Button>
            </div>
          </form>
        ) : (
          // Display Mode
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">ชื่อ-นามสกุล</label>
              <p className="mt-1 text-lg text-gray-900">{user.displayName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">อีเมล</label>
              <div className="mt-1 flex items-center space-x-2">
                <p className="text-lg text-gray-900">{user.email}</p>
                {isEmailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ยืนยันแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ยังไม่ยืนยัน
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">บทบาท</label>
              <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Email Verification Card */}
      {!isEmailVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                อีเมลของคุณยังไม่ได้รับการยืนยัน
              </h3>
              <p className="mt-2 text-sm text-yellow-700">
                กรุณายืนยันอีเมลของคุณเพื่อใช้งานฟีเจอร์ทั้งหมดของแอปพลิเคชัน
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => sendVerificationMutation.mutate()}
                  isLoading={sendVerificationMutation.isPending}
                >
                  ส่งอีเมลยืนยัน
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Actions Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">การตั้งค่าบัญชี</h2>
        <div className="space-y-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-start"
            onClick={() => navigate('/change-password')}
          >
            เปลี่ยนรหัสผ่าน
          </Button>
        </div>
      </div>
    </div>
  );
}
