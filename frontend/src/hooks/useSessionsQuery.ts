/**
 * Kumpulan hooks untuk mengelola sesi belajar dalam grup menggunakan React Query.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '../api/sessions.api';
import type { CreateSessionPayload } from '../types';

export function useGroupSessionsQuery(groupId: string) {
  return useQuery({
    queryKey: ['sessions', 'list', groupId],
    queryFn: () => sessionsApi.getGroupSessions(groupId),
    enabled: !!groupId,
  });
}

export function useSessionDetailsQuery(sessionId: string) {
  return useQuery({
    queryKey: ['sessions', 'detail', sessionId],
    queryFn: () => sessionsApi.getSessionDetails(sessionId).then((res) => res.data),
    enabled: !!sessionId,
  });
}

export function useCreateSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: CreateSessionPayload }) =>
      sessionsApi.createSession(groupId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', 'list', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] }); // Updates points/level badge
    },
  });
}

export function useJoinSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.joinSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', 'detail', sessionId] });
    },
  });
}

export function useLeaveSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.leaveSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', 'detail', sessionId] });
    },
  });
}

export function useUpdateSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, payload }: { sessionId: string; payload: { status?: string; title?: string } }) =>
      sessionsApi.updateSession(sessionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', 'detail', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'list'] });
    },
  });
}

export function useDeleteSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', 'list'] });
    },
  });
}
