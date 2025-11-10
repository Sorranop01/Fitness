import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, type CreateBookingInput } from '../api/bookingApi';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['bookings', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'upcoming', data.userId] });

      // If it's a class booking, invalidate class queries
      if (data.classId) {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        queryClient.invalidateQueries({ queryKey: ['class', data.classId] });
      }
    },
  });
}
