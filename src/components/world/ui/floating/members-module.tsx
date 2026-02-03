"use client";

import { Users } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { MembersList } from "@/components/members";

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
      <MembersList
        worldId={worldId}
        worldOwnerId={worldOwnerId}
        currentUserId={currentUserId}
      />
    </FloatingPanel>
  );
}
