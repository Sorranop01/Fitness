import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../api/authApi';
import { handleFirebaseError } from '@/utils/handleFirebaseError';
import { useUIStore } from '@/store/useUIStore';

export function useLogout() {
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      showToast('ออกจากระบบสำเร็จ', 'success');
    },
    onError: (error: unknown) => {
      const errorMessage = handleFirebaseError(error);
      showToast(errorMessage, 'error');
    },
  });
}
