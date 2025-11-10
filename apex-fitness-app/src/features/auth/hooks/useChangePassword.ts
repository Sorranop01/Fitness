import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../api/authApi';
import { handleFirebaseError } from '@/utils/handleFirebaseError';
import { useUIStore } from '@/store/useUIStore';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: ChangePasswordData) => changePassword(data),
    onSuccess: () => {
      showToast('เปลี่ยนรหัสผ่านสำเร็จ', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage = handleFirebaseError(error);
      showToast(errorMessage, 'error');
    },
  });
}
