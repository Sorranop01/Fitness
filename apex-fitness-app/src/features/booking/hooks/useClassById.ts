import { useQuery } from '@tanstack/react-query';
import { getClassById } from '../api/classApi';

export function useClassById(classId: string) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassById(classId),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
