import { useQuery } from '@tanstack/react-query';
import { getUpcomingClasses } from '../api/classApi';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: () => getUpcomingClasses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
