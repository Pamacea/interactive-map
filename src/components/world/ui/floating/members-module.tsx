"use client";

import { Suspense, useEffect } from "react";
import { Users } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { MembersList } from "@/components/members";
import { PresenceMembersList } from "./presence-members-list";
import { usePanelState } from "@/store/use-floating-panels-store";

interface MembersModuleProps {
  worldId: string;
  worldOwnerId: string;
  currentUserId: string;
}

/**
 * MembersModule - Floating panel for collaboration/presence
 *
 * Features:
 * - Lazy loading (only renders when visible)
 * - Real-time presence tracking
 * - Suspense boundary
 */
export function MembersModule({ worldId, worldOwnerId, currentUserId }: MembersModuleProps) {
  const { isVisible } = usePanelState("members");

  // Only render content when visible to save resources
  if (!isVisible) {
    return (
      <FloatingPanel
        panelId="members"
        title="Members"
        icon={<Users className="w-4 h-4" />}
      >
        {/* Content will load when panel opens */}
      </FloatingPanel>
    );
  }

  return (
    <FloatingPanel
      panelId="members"
      title="Members"
      icon={<Users className="w-4 h-4" />}
    >
      <Suspense fallback={<MembersListSkeleton />}>
        <PresenceMembersList
          worldId={worldId}
          worldOwnerId={worldOwnerId}
          currentUserId={currentUserId}
        />
      </Suspense>
    </FloatingPanel>
  );
}

function MembersListSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-12 bg-slate-800/50 rounded-sm animate-pulse" />
      <div className="h-12 bg-slate-800/50 rounded-sm animate-pulse" />
      <div className="h-12 bg-slate-800/50 rounded-sm animate-pulse" />
    </div>
  );
}
