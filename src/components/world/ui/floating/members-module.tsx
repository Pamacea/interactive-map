"use client";

import { Suspense } from "react";
import { Users } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { MembersList } from "@/components/members";
import { PresenceMembersList } from "./presence-members-list";

interface MembersModuleProps {
  worldId: string;
  worldOwnerId: string;
  currentUserId: string;
}

export function MembersModule({ worldId, worldOwnerId, currentUserId }: MembersModuleProps) {
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
