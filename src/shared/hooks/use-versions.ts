'use client';

import { useQuery, useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import {
  createVersion,
  getWorldVersions,
  restoreVersion,
  deleteVersion,
  updateVersion,
} from '@/features/versions/actions';
import type { Result } from '@/shared/lib/errors';

export type Version = {
  id: string;
  version: number;
  title: string;
  changelog: string | null;
  isAuto: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export function useVersions(worldId: string, enabled = true) {
  return useQuery<Version[]>({
    queryKey: ['versions', worldId],
    queryFn: async () => {
      try {
        const result = await getWorldVersions(worldId);
        if (!result.success) {
          if (result.error?.code === 'AUTHENTICATION_ERROR') {
            return [];
          }
          throw new Error(result.error?.message || 'Failed to fetch versions');
        }
        return result.data;
      } catch (error: any) {
        if (error?.code === 'AUTHENTICATION_ERROR' ||
            error?.message?.includes('Authentication') ||
            error?.message?.includes('logged in')) {
          return [];
        }
        throw error;
      }
    },
    enabled: enabled && !!worldId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
    retry: (failureCount, error) => {
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes('Authentication') || errorMsg.includes('Unauthorized') || errorMsg.includes('logged in')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateVersion(): UseMutationResult<
  Result<{ version: number; id: string }>,
  Error,
  Parameters<typeof createVersion>[0]
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVersion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['versions', variables.worldId] });
    },
  });
}

export function useRestoreVersion(): UseMutationResult<
  Result<{ restoredTo: number }>,
  Error,
  Parameters<typeof restoreVersion>[0]
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreVersion,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['versions'] });
        queryClient.invalidateQueries({ queryKey: ['worlds'] });
        queryClient.invalidateQueries({ queryKey: ['pins'] });
        queryClient.invalidateQueries({ queryKey: ['layers'] });
      }
    },
  });
}

export function useDeleteVersion(): UseMutationResult<
  Result<{ success: boolean }>,
  Error,
  Parameters<typeof deleteVersion>[0]
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    },
  });
}

export function useUpdateVersion(): UseMutationResult<
  Result<{ success: boolean }>,
  Error,
  Parameters<typeof updateVersion>[0]
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    },
  });
}
