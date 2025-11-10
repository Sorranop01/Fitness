import { useQuery } from '@tanstack/react-query';
import { getBookingById } from '../api/bookingApi';

export function useBookingById(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
