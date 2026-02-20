"use client";

import * as React from "react";
import {
  Shield,
  UserPlus,
  Mail,
  Crown,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Copy,
  Link as LinkIcon,
  Check,
  X,
  Loader2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorldMembers,
  getPendingInvites,
  addWorldMember,
  updateWorldMemberPermission,
  removeWorldMember,
  createInvite,
  createShareLink,
  revokeInvite,
} from "@/actions/worlds";
import type { Permission, WorldMember } from "@/types/world.type";

interface PermissionsPanelProps {
  worldId: string;
  isOwner: boolean;
  userId: string;
}

const PERMISSION_LABELS: Record<Permission, string> = {
  OWNER: "Owner",
  EDITOR: "Editor",
  READER: "Viewer",
};

const PERMISSION_ICONS: Record<Permission, React.ReactNode> = {
  OWNER: <Crown className="w-3 h-3" />,
  EDITOR: <Edit2 className="w-3 h-3" />,
  READER: <Eye className="w-3 h-3" />,
};

const PERMISSION_COLORS: Record<Permission, string> = {
  OWNER: "text-amber-400 bg-amber-500/20 border-amber-500/30",
  EDITOR: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  READER: "text-gray-400 bg-gray-500/20 border-gray-500/30",
};

/**
 * PermissionsPanel - Full permissions management UI
 *
 * Features:
 * - View all members with their roles
 * - Add members by email (if they have an account)
 * - Invite via email link
 * - Create shareable links
 * - Change member permissions
 * - Remove members
 * - View and revoke pending invites
 */
export function PermissionsPanel({ worldId, isOwner, userId }: PermissionsPanelProps) {
  const _queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [invitePermission, setInvitePermission] = React.useState<Permission>("READER");
  const [showInviteDialog, setShowInviteDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState<string | null>(null);

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

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: ({ email, permission }: { email: string; permission: Permission }) =>
      addWorldMember(worldId, email, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-members", worldId] });
      setShowInviteDialog(false);
      setInviteEmail("");
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
      setShowInviteDialog(false);
      setInviteEmail("");
    },
  });

  // Create share link mutation
  const createShareLinkMutation = useMutation({
    mutationFn: (permission: Permission) => createShareLink(worldId, permission, 30),
    onSuccess: (data) => {
      if (data && "token" in data) {
        const link = `${window.location.origin}/invite/${data.token}`;
        setCopiedLink(link);
        setShowShareDialog(true);
      }
    },
  });

  // Revoke invite mutation
  const revokeInviteMutation = useMutation({
    mutationFn: (inviteId: string) => revokeInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["world-invites", worldId] });
    },
  });

  const _handleAddMember = () => {
    if (inviteEmail.trim()) {
      addMemberMutation.mutate({ email: inviteEmail, permission: invitePermission });
    }
  };

  const handleCreateInvite = () => {
    if (inviteEmail.trim()) {
      createInviteMutation.mutate({ email: inviteEmail, permission: invitePermission });
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateShareLink = (permission: Permission) => {
    createShareLinkMutation.mutate(permission);
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
              disabled={createShareLinkMutation.isPending}
              className="h-7 gap-1.5 px-2.5 text-xs text-text-secondary hover:bg-white/5 hover:text-text-primary"
            >
              <LinkIcon className="w-3.5 h-3.5" />
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
                  updatePermissionMutation.mutate({ memberId: member.id, permission })
                }
                onRemove={() => removeMemberMutation.mutate(member.id)}
                _isUpdating={updatePermissionMutation.isPending}
                _isRemoving={removeMemberMutation.isPending}
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
            {invites.map((invite: { id: string; email: string; permission: string }) => (
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
                    onClick={() => revokeInviteMutation.mutate(invite.id)}
                    className="h-6 w-6 text-text-muted hover:text-blood hover:bg-blood/10"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent-gold" />
              Invite to World
            </DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on this world.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs text-text-muted">Email Address</label>
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-background-input border-border-subtle"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text-muted">Permission Level</label>
              <Select value={invitePermission} onValueChange={(v) => setInvitePermission(v as Permission)}>
                <SelectTrigger className="bg-background-input border-border-subtle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="READER">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-xs text-text-muted">Can view only</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="EDITOR">
                    <div className="flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Editor</p>
                        <p className="text-xs text-text-muted">Can edit pins and layers</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="OWNER" disabled={!isOwner}>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Owner</p>
                        <p className="text-xs text-text-muted">Full control</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowInviteDialog(false)}
              disabled={createInviteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateInvite}
              disabled={!inviteEmail.trim() || createInviteMutation.isPending}
              className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
            >
              {createInviteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Link Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-accent-gold" />
              Shareable Link Created
            </DialogTitle>
            <DialogDescription>
              Anyone with this link can join your world.
            </DialogDescription>
          </DialogHeader>
          {copiedLink && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-background-input border border-border-subtle rounded-sm">
                <code className="flex-1 text-xs text-text-secondary truncate">
                  {copiedLink}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyLink(copiedLink)}
                  className="flex-shrink-0"
                >
                  {copiedLink === copiedLink ? (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1 text-green-400" />
                      Copied
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-text-muted">
                This link will expire in 30 days. Viewers can see the map but not edit it.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MemberRowProps {
  member: WorldMember & { user: { id: string; name: string | null; email: string | null; image: string | null } };
  isOwner: boolean;
  currentUserId: string;
  onUpdatePermission: (permission: Permission) => void;
  onRemove: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

function MemberRow({
  member,
  isOwner,
  currentUserId,
  onUpdatePermission,
  onRemove,
  isUpdating: _isUpdating,
  isRemoving,
}: MemberRowProps) {
  const isCurrentUser = member.user.id === currentUserId;
  const canModify = isOwner && !isCurrentUser;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-black/20 border border-border-subtle group">
      {/* Avatar */}
      {member.user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.user.image}
          alt={member.user.name ?? "User"}
          className="w-6 h-6 rounded-full object-cover ring-1 ring-inset ring-white/10 flex-shrink-0"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-3 h-3 text-accent-gold" />
        </div>
      )}

      {/* Name and email */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary truncate">
          {member.user.name || member.user.email || "Unknown User"}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-text-muted">(You)</span>
          )}
        </p>
      </div>

      {/* Permission badge */}
      {canModify ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border transition-colors",
                PERMISSION_COLORS[member.permission]
              )}
            >
              {PERMISSION_ICONS[member.permission]}
              <span>{PERMISSION_LABELS[member.permission]}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdatePermission("READER")}>
              <Eye className="w-4 h-4 mr-2" />
              Viewer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdatePermission("EDITOR")}>
              <Edit2 className="w-4 h-4 mr-2" />
              Editor
            </DropdownMenuItem>
            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onUpdatePermission("OWNER")}>
                  <Crown className="w-4 h-4 mr-2" />
                  Owner
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border",
            PERMISSION_COLORS[member.permission]
          )}
        >
          {PERMISSION_ICONS[member.permission]}
          {PERMISSION_LABELS[member.permission]}
        </span>
      )}

      {/* Actions */}
      {canModify && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "p-1 rounded transition-colors",
                "opacity-0 group-hover:opacity-100",
                "hover:bg-white/10 text-text-muted hover:text-text-secondary"
              )}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onRemove}
              disabled={isRemoving}
              className="text-blood hover:text-blood hover:bg-blood/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
