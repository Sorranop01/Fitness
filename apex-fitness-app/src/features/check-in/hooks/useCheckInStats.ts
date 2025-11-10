import { useQuery } from '@tanstack/react-query';
import { getCheckInStats } from '../api/checkInApi';

export function useCheckInStats(userId: string) {
  return useQuery({
    queryKey: ['checkIn', 'stats', userId],
    queryFn: () => getCheckInStats(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
