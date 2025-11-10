import { useMutation } from '@tanstack/react-query';
import { sendVerificationEmail } from '../api/authApi';
import { handleFirebaseError } from '@/utils/handleFirebaseError';
import { useUIStore } from '@/store/useUIStore';

export function useSendVerificationEmail() {
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: () => sendVerificationEmail(),
    onSuccess: () => {
      showToast('ส่งอีเมลยืนยันแล้ว กรุณาตรวจสอบอีเมลของคุณ', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage = handleFirebaseError(error);
      showToast(errorMessage, 'error');
    },
  });
}
