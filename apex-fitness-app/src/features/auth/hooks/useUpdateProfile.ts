import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '../api/authApi';
import { handleFirebaseError } from '@/utils/handleFirebaseError';
import { useUIStore } from '@/store/useUIStore';

export function useUpdateProfile() {
  const showToast = useUIStore((state) => state.showToast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { displayName?: string }) => updateUserProfile(data),
    onSuccess: () => {
      showToast('อัพเดทโปรไฟล์สำเร็จ', 'success');
      // Invalidate queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: unknown) => {
      const errorMessage = handleFirebaseError(error);
      showToast(errorMessage, 'error');
    },
  });
}
