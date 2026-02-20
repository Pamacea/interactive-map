"use client";

import { Shield, Crown, Eye, Edit2, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import type { Permission, WorldMember } from "@/types/world.type";

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

interface MemberRowProps {
  member: WorldMember & { user: { id: string; name: string | null; email: string | null; image: string | null } };
  isOwner: boolean;
  currentUserId: string;
  onUpdatePermission: (permission: Permission) => void;
  onRemove: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

/**
 * Member Row
 * Displays a single member in the permissions list with actions
 */
export function MemberRow({
  member,
  isOwner,
  currentUserId,
  onUpdatePermission,
  onRemove,
  isUpdating,
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
