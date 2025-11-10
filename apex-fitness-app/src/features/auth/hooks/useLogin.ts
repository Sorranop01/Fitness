import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { handleFirebaseError } from '@/utils/handleFirebaseError';
import { useUIStore } from '@/store/useUIStore';

interface LoginData {
  email: string;
  password: string;
}

export function useLogin() {
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: LoginData) => loginUser(data),
    onSuccess: (user) => {
      showToast(`ยินดีต้อนรับ ${user.displayName}`, 'success');
    },
    onError: (error: unknown) => {
      const errorMessage = handleFirebaseError(error);
      showToast(errorMessage, 'error');
    },
  });
}
