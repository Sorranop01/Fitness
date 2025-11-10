import { useQuery } from '@tanstack/react-query';
import { getUserBookings, getUpcomingBookings } from '../api/bookingApi';

/**
 * Hook to get all user bookings
 */
export function useBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => getUserBookings(userId),
    enabled: !!userId, // Only run if userId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get upcoming bookings only
 */
export function useUpcomingBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', 'upcoming', userId],
    queryFn: () => getUpcomingBookings(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
