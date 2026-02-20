import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addWorldMember,
  updateWorldMemberPermission,
  removeWorldMember,
  createInvite,
  createShareLink,
  revokeInvite,
} from "@/features/worlds";
import type { Permission } from "@/types/world.type";

interface UsePermissionsMutationsProps {
  worldId: string;
}

/**
 * Permissions Mutations Hook
 * Handles all permission-related mutations with proper cache invalidation
 */
export function usePermissionsMutations({ worldId }: UsePermissionsMutationsProps) {
  const _queryClient = useQueryClient();

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: ({ email, permission }: { email: string; permission: Permission }) =>
      addWorldMember(worldId, email, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-members", worldId] });
    },
  });

  // Update permission mutation
  const updatePermissionMutation = useMutation({
    mutationFn: ({ memberId, permission }: { memberId: string; permission: Permission }) =>
      updateWorldMemberPermission(memberId, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-members", worldId] });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeWorldMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-members", worldId] });
    },
  });

  // Create invite mutation
  const createInviteMutation = useMutation({
    mutationFn: ({ email, permission }: { email: string; permission: Permission }) =>
      createInvite(worldId, email, permission, 7),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-invites", worldId] });
    },
  });

  // Create share link mutation
  const createShareLinkMutation = useMutation({
    mutationFn: (permission: Permission) => createShareLink(worldId, permission, 30),
  });

  // Revoke invite mutation
  const revokeInviteMutation = useMutation({
    mutationFn: (inviteId: string) => revokeInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-invites", worldId] });
    },
  });

  return {
    addMemberMutation,
    updatePermissionMutation,
    removeMemberMutation,
    createInviteMutation,
    createShareLinkMutation,
    revokeInviteMutation,
  };
}
