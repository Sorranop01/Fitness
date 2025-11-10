import { useMutation } from '@tanstack/react-query';
import { sendPasswordReset } from '../api/authApi';
import { handleFirebaseError } from '@/utils/handleFirebaseError';
import { useUIStore } from '@/store/useUIStore';

export function useForgotPassword() {
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: (email: string) => sendPasswordReset(email),
    onSuccess: () => {
      showToast('ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage = handleFirebaseError(error);
      showToast(errorMessage, 'error');
    },
  });
}
