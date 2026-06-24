/**
 * Kumpulan hooks untuk mengelola query dan mutasi materi pembelajaran menggunakan React Query.
 */
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsApi } from '../api/materials.api';

export function useMaterialsInfiniteQuery(groupId: string, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['materials', 'infinite', groupId, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await materialsApi.getGroupMaterials(groupId, {
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
    enabled: !!groupId,
  });
}

export function useUploadMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, formData }: { groupId: string; formData: FormData }) =>
      materialsApi.uploadMaterial(groupId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materials', 'infinite', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] }); // Updates points/level badge
    },
  });
}

export function useDeleteMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { groupId: string; materialId: string }) =>
      materialsApi.deleteMaterial(variables.materialId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materials', 'infinite', variables.groupId] });
    },
  });
}
