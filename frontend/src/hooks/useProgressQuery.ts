/**
 * Hook untuk mengambil data progres belajar pengguna menggunakan React Query.
 */
import { useQuery } from '@tanstack/react-query';
import { progressApi } from '../api/progress.api';

export function useUserProgressQuery() {
  return useQuery({
    queryKey: ['userProgress'],
    queryFn: () => progressApi.getUserProgress().then((res) => res.data || []),
  });
}

export function useProgressSummaryQuery() {
  return useQuery({
    queryKey: ['progressSummary'],
    queryFn: () => progressApi.getProgressSummary().then((res) => res.data || null),
  });
}
