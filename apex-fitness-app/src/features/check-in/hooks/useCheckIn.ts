import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkIn } from '../api/checkInApi';

interface CheckInInput {
  bookingId: string;
  userId: string;
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, userId }: CheckInInput) => checkIn(bookingId, userId),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['bookings', data.booking.userId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'upcoming', data.booking.userId] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.booking.id] });
      queryClient.invalidateQueries({ queryKey: ['checkIn', 'today', data.booking.userId] });
      queryClient.invalidateQueries({ queryKey: ['checkIn', 'history', data.booking.userId] });
      queryClient.invalidateQueries({ queryKey: ['checkIn', 'stats', data.booking.userId] });
    },
  });
}
