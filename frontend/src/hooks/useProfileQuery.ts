/**
 * Kumpulan hooks untuk mengelola data profil pengguna dan leaderboard menggunakan React Query.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => usersApi.getProfile().then((res) => res.data),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; bio?: string; timezone?: string }) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] }); // Syncs auth context if name changed
    },
  });
}

export function useUpdateLearningStyleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { primaryStyle: string }) => usersApi.updateLearningStyle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useLeaderboardQuery(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => usersApi.getLeaderboard(limit).then((res) => res.data),
  });
}
