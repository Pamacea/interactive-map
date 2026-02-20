"use client";

import * as React from "react";
import { UserPlus, Eye, Edit2, Crown, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { Permission } from "@/types/world.type";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  permission: Permission;
  onPermissionChange: (permission: Permission) => void;
  onInvite: () => void;
  isLoading: boolean;
  isOwner: boolean;
}

/**
 * Invite Member Dialog
 * Modal for inviting users to a world via email
 */
export function InviteDialog({
  open,
  onOpenChange,
  email,
  onEmailChange,
  permission,
  onPermissionChange,
  onInvite,
  isLoading,
  isOwner,
}: InviteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="bg-background-input border-border-subtle"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Permission Level</label>
            <Select value={permission} onValueChange={(v) => onPermissionChange(v as Permission)}>
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
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onInvite}
            disabled={!email.trim() || isLoading}
            className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
