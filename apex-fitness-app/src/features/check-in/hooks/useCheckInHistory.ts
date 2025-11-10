import { useQuery } from '@tanstack/react-query';
import { getCheckInHistory } from '../api/checkInApi';

export function useCheckInHistory(userId: string, limitCount = 20) {
  return useQuery({
    queryKey: ['checkIn', 'history', userId, limitCount],
    queryFn: () => getCheckInHistory(userId, limitCount),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
