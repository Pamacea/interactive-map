"use client";

import * as React from "react";
import { Link as LinkIcon, Check, Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareLink: string | null;
  onCopy: (link: string) => void;
}

/**
 * Share Link Dialog
 * Displays a created shareable link for the world
 */
export function ShareLinkDialog({
  open,
  onOpenChange,
  shareLink,
  onCopy,
}: ShareLinkDialogProps) {
  const [copiedLink, setCopiedLink] = React.useState<string | null>(null);
  const isCopied = copiedLink === shareLink;

  const handleCopy = () => {
    if (shareLink) {
      onCopy(shareLink);
      setCopiedLink(shareLink);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  // Reset copied state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setCopiedLink(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        {shareLink && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-background-input border border-border-subtle rounded-sm">
              <code className="flex-1 text-xs text-text-secondary truncate">
                {shareLink}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
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
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
