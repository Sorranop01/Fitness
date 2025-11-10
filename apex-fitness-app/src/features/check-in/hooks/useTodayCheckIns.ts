import { useQuery } from '@tanstack/react-query';
import { getTodayCheckInEligibleBookings } from '../api/checkInApi';

export function useTodayCheckIns(userId: string) {
  return useQuery({
    queryKey: ['checkIn', 'today', userId],
    queryFn: () => getTodayCheckInEligibleBookings(userId),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
}
