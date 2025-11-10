import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '../api/bookingApi';

interface CancelBookingInput {
  bookingId: string;
  userId: string;
  classId?: string;
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId }: CancelBookingInput) => cancelBooking(bookingId),
    onSuccess: (_data, variables) => {
      // Invalidate booking queries
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'upcoming', variables.userId] });

      // If it's a class booking, invalidate class queries
      if (variables.classId) {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        queryClient.invalidateQueries({ queryKey: ['class', variables.classId] });
      }
    },
  });
}
