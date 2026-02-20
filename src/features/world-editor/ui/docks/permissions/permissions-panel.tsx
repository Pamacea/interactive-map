"use client";

import * as React from "react";
import {
  Shield,
  UserPlus,
  Mail,
  Crown,
  Eye,
  Edit2,
  Loader2,
  Users,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  getWorldMembers,
  getPendingInvites,
} from "@/features/worlds";
import type { Permission } from "@/types/world.type";
import { usePermissionsMutations } from "./use-permissions-mutations";
import { InviteDialog } from "./invite-dialog";
import { ShareLinkDialog } from "./share-link-dialog";
import { MemberRow } from "./member-row";

const PERMISSION_LABELS: Record<Permission, string> = {
  OWNER: "Owner",
  EDITOR: "Editor",
  READER: "Viewer",
};

const PERMISSION_COLORS: Record<Permission, string> = {
  OWNER: "text-amber-400 bg-amber-500/20 border-amber-500/30",
  EDITOR: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  READER: "text-gray-400 bg-gray-500/20 border-gray-500/30",
};

const PERMISSION_ICONS: Record<Permission, React.ReactNode> = {
  OWNER: <Crown className="w-3 h-3" />,
  EDITOR: <Edit2 className="w-3 h-3" />,
  READER: <Eye className="w-3 h-3" />,
};

interface PermissionsPanelProps {
  worldId: string;
  isOwner: boolean;
  userId: string;
}

/**
 * Permissions Panel
 * Full permissions management UI for world members
 */
export function PermissionsPanel({ worldId, isOwner, userId }: PermissionsPanelProps) {
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [invitePermission, setInvitePermission] = React.useState<Permission>("READER");
  const [showInviteDialog, setShowInviteDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [shareLink, setShareLink] = React.useState<string | null>(null);

  // Fetch members and invites
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ["world-members", worldId],
    queryFn: () => getWorldMembers(worldId),
    enabled: !!worldId,
  });

  const { data: invites = [], isLoading: isLoadingInvites } = useQuery({
    queryKey: ["world-invites", worldId],
    queryFn: () => getPendingInvites(worldId),
    enabled: !!worldId,
  });

  const mutations = usePermissionsMutations({ worldId });

  const handleAddMember = () => {
    if (inviteEmail.trim()) {
      mutations.addMemberMutation.mutate(
        { email: inviteEmail, permission: invitePermission },
        {
          onSuccess: () => {
            setShowInviteDialog(false);
            setInviteEmail("");
          },
        }
      );
    }
  };

  const handleCreateInvite = () => {
    if (inviteEmail.trim()) {
      mutations.createInviteMutation.mutate(
        { email: inviteEmail, permission: invitePermission },
        {
          onSuccess: () => {
            setShowInviteDialog(false);
            setInviteEmail("");
          },
        }
      );
    }
  };

  const handleCreateShareLink = (permission: Permission) => {
    mutations.createShareLinkMutation.mutate(permission, {
      onSuccess: (data) => {
        if (data && "token" in data) {
          const link = `${window.location.origin}/invite/${data.token}`;
          setShareLink(link);
          setShowShareDialog(true);
        }
      },
    });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const isLoading = isLoadingMembers || isLoadingInvites;

  return (
    <div className="space-y-3">
      {/* Section Header with Action Buttons */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-text-muted" />
          <h3 className="text-xs font-display text-text-muted uppercase tracking-wide">
            Members ({members.length})
          </h3>
        </div>

        {/* Action buttons for owners */}
        {isOwner && (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowInviteDialog(true)}
              className="h-7 gap-1.5 px-2.5 text-xs text-accent-gold hover:bg-accent-gold/10 hover:text-accent-gold/80"
            >
              <Mail className="w-3.5 h-3.5" />
              Invite
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCreateShareLink("READER")}
              disabled={mutations.createShareLinkMutation.isPending}
              className="h-7 gap-1.5 px-2.5 text-xs text-text-secondary hover:bg-white/5 hover:text-text-primary"
            >
              <Mail className="w-3.5 h-3.5" />
              Share
            </Button>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-accent-gold" />
          </div>
        ) : members.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">No members yet</p>
        ) : (
          <div className="space-y-1">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                isOwner={isOwner}
                currentUserId={userId}
                onUpdatePermission={(permission) =>
                  mutations.updatePermissionMutation.mutate({ memberId: member.id, permission })
                }
                onRemove={() => mutations.removeMemberMutation.mutate(member.id)}
                isUpdating={mutations.updatePermissionMutation.isPending}
                isRemoving={mutations.removeMemberMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="space-y-1.5">
          {/* Pending Invites Header */}
          <div className="flex items-center gap-2 px-1">
            <Mail className="w-4 h-4 text-text-muted" />
            <h3 className="text-xs font-display text-text-muted uppercase tracking-wide">
              Pending ({invites.length})
            </h3>
          </div>

          {/* Pending Invites List */}
          <div className="space-y-1">
            {invites.map((invite: any) => (
              <div
                key={invite.id}
                className="flex items-center gap-2 px-3 py-2 rounded-sm bg-black/20 border border-border-subtle group"
              >
                <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-accent-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary truncate">
                    {invite.email || "Anyone with link"}
                  </p>
                  <p className="text-xs text-text-muted">
                    {PERMISSION_LABELS[invite.permission as Permission]} • expires{" "}
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                {isOwner && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => mutations.revokeInviteMutation.mutate(invite.id)}
                    className="h-6 w-6 text-text-muted hover:text-blood hover:bg-blood/10"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Dialog */}
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        email={inviteEmail}
        onEmailChange={setInviteEmail}
        permission={invitePermission}
        onPermissionChange={setInvitePermission}
        onInvite={handleCreateInvite}
        isLoading={mutations.createInviteMutation.isPending}
        isOwner={isOwner}
      />

      {/* Share Link Dialog */}
      <ShareLinkDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareLink={shareLink}
        onCopy={handleCopyLink}
      />
    </div>
  );
}

export { PERMISSION_LABELS, PERMISSION_COLORS, PERMISSION_ICONS };
