import { useQuery } from '@tanstack/react-query';
import { validateCheckIn } from '../api/checkInApi';

export function useValidateCheckIn(bookingId: string, enabled = true) {
  return useQuery({
    queryKey: ['checkIn', 'validate', bookingId],
    queryFn: () => validateCheckIn(bookingId),
    enabled: enabled && !!bookingId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute to update time windows
  });
}
