"use client";

import * as React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="border-b border-border-subtle last:border-b-0">
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-background-elevated transition-colors group [&[data-state=open]>svg]:rotate-180">
        <span className="text-sm font-semibold text-text-primary uppercase tracking-wide">{title}</span>
        <ChevronDown className="w-4 h-4 text-text-muted transition-transform duration-200" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
