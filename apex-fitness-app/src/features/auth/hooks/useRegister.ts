import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/authApi';
import { handleFirebaseError } from '@/utils/handleFirebaseError';
import { useUIStore } from '@/store/useUIStore';

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export function useRegister() {
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: RegisterData) => registerUser(data),
    onSuccess: (user) => {
      showToast(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ ${user.displayName}`, 'success');
    },
    onError: (error: unknown) => {
      const errorMessage = handleFirebaseError(error);
      showToast(errorMessage, 'error');
    },
  });
}
