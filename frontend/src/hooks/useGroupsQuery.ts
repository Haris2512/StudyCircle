/**
 * Kumpulan hooks untuk mengelola query dan mutasi terkait data grup belajar menggunakan React Query.
 */
import { useQuery, useInfiniteQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { groupsApi } from '../api/groups.api';
import type { CreateGroupPayload } from '../types';
import { matchApi } from '../api/match.api';

export function useRecommendationsQuery(subjectId?: string) {
  return useQuery({
    queryKey: ['groups', 'recommendations', subjectId],
    queryFn: () => matchApi.getRecommendations(subjectId),
  });
}

export function useGroupsInfiniteQuery(filters?: { subjectId?: string; search?: string; limit?: number }) {
  const limit = filters?.limit ?? 12;

  return useInfiniteQuery({
    queryKey: ['groups', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await groupsApi.getAllGroups({
        subjectId: filters?.subjectId,
        search: filters?.search,
        page: pageParam as number,
        limit,
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    placeholderData: keepPreviousData,
  });
}

export function useGroupDetailQuery(groupId: string) {
  return useQuery({
    queryKey: ['groups', 'detail', groupId],
    queryFn: () => groupsApi.getGroupById(groupId),
    enabled: !!groupId,
  });
}

export function useGroupMembersQuery(groupId: string) {
  return useQuery({
    queryKey: ['groups', 'members', groupId],
    queryFn: () => groupsApi.getMembers(groupId),
    enabled: !!groupId,
  });
}

export function useJoinGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupsApi.joinGroup(groupId),
    onSuccess: () => {
      // Invalidate both detail and infinite list queries
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] }); // Updates user profile/points/groups
    },
  });
}

export function useLeaveGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupsApi.leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => groupsApi.createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupsApi.removeMember(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'members', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'detail', variables.groupId] });
    },
  });
}
