'use client';

import { useQuery, useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import {
  createImportJob,
  processImportJob,
  getWorldImportJobs,
  cancelImportJob,
} from '@/features/import/actions';
import type { Result, ImportSourceType } from '@/features/import/actions';

export type ImportJob = {
  id: string;
  sourceType: string;
  filename: string | null;
  status: string;
  progress: number;
  error: string | null;
  processed: { pins?: number; layers?: number } | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export function useImportJobs(worldId: string, enabled = true) {
  return useQuery<ImportJob[]>({
    queryKey: ['importJobs', worldId],
    queryFn: async () => {
      try {
        const result = await getWorldImportJobs(worldId);
        if (!result.success) {
          if (result.error?.code === 'AUTHENTICATION_ERROR') {
            return [];
          }
          throw new Error(result.error?.message || 'Failed to fetch import jobs');
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
    staleTime: 0, // Always refresh for jobs
    refetchInterval: (data = []) => {
      // Poll for pending/processing jobs
      // data is the unwrapped array from queryFn, with empty array fallback for errors
      if (!Array.isArray(data)) return false;
      const hasActiveJobs = data.some((j) => j.status === 'PENDING' || j.status === 'PROCESSING');
      return hasActiveJobs ? 2000 : false; // Poll every 2s if active jobs
    },
    retry: (failureCount, error) => {
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes('Authentication') || errorMsg.includes('Unauthorized') || errorMsg.includes('logged in')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateImportJob(): UseMutationResult<
  Result<{ id: string; status: string }>,
  Error,
  Parameters<typeof createImportJob>[0]
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createImportJob,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['importJobs', variables.worldId] });
    },
  });
}

export function useProcessImportJob(): UseMutationResult<
  Result<{ status: string; result?: { pins: number; layers: number } }>,
  Error,
  Parameters<typeof processImportJob>[0]
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processImportJob,
    onSuccess: (data) => {
      if (data.success) {
        // We need the worldId to invalidate, but we don't have it directly
        // Invalidate all import job queries
        queryClient.invalidateQueries({ queryKey: ['importJobs'] });
        queryClient.invalidateQueries({ queryKey: ['pins'] });
        queryClient.invalidateQueries({ queryKey: ['layers'] });
      }
    },
  });
}

export function useCancelImportJob(): UseMutationResult<
  Result<{ success: boolean }>,
  Error,
  Parameters<typeof cancelImportJob>[0]
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelImportJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importJobs'] });
    },
  });
}
