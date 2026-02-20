/**
 * PropertyToggle - Reusable toggle/switch for property panels
 *
 * Features:
 * - Consistent styling
 * - Label and description
 * - Icon support
 */

import * as React from "react";
import { Switch } from "@/shared/ui/switch";
import { cn } from "@/shared/utils";

export interface PropertyToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  containerClassName?: string;
  id?: string;
}

export function PropertyToggle({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  icon,
  containerClassName,
  id,
}: PropertyToggleProps) {
  const toggleId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2.5 bg-obsidian/60 border border-border-subtle transition-colors",
        disabled && "opacity-50",
        containerClassName
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-text-muted flex-shrink-0">{icon}</span>
        )}
        <div>
          <span className="text-sm text-text-secondary block">{label}</span>
          {description && (
            <p className="text-xs text-text-muted">{description}</p>
          )}
        </div>
      </div>
      <Switch
        id={toggleId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
