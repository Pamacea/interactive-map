import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { isLucideIconName } from "@/lib/icon-utils";

interface PinTypeConfig {
  icon: string;
  color: string;
  label: string;
  description?: string;
}

interface PinTypeMenuItemProps {
  type: string;
  config: PinTypeConfig;
  onSelect: (type: string) => void;
}

interface IconWrapperProps {
  iconName: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper component to render Lucide icons
 * Declared outside render to satisfy react-hooks/static-components rule
 */
function IconWrapper({ iconName, className, style }: IconWrapperProps) {
  if (!isLucideIconName(iconName)) {
    return <LucideIcons.MapPin className={className} style={style} />;
  }

  const IconComponent = LucideIcons[iconName] as React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;

  return <IconComponent className={className} style={style} />;
}

export function PinTypeMenuItem({
  type,
  config,
  onSelect,
}: PinTypeMenuItemProps) {
  return (
    <button
      onClick={() => onSelect(type)}
      role="menuitem"
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-sm",
        "text-left transition-all duration-150",
        "hover:bg-accent-gold/10 hover:border hover:border-accent-gold/50",
        "group focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
      )}
      title={config.description}
      aria-label={`Create ${config.label} pin${config.description ? `: ${config.description}` : ""}`}
      type="button"
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-sm"
        style={{
          backgroundColor: `${config.color}20`,
          border: `1px solid ${config.color}40`,
        }}
        aria-hidden="true"
      >
        <IconWrapper
          iconName={config.icon}
          className="h-4 w-4"
          style={{ color: config.color }}
        />
      </div>

      <span className="flex-1 text-sm font-medium text-text-primary group-hover:text-accent-gold">
        {config.label}
      </span>

      <div
        className="h-3 w-3 rounded-full shadow-sm"
        style={{ backgroundColor: config.color }}
        aria-hidden="true"
      />
    </button>
  );
}
