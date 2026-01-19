import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { getPinEmoji } from "../utils/pin-popup-utils";

interface PopupTypeIconProps {
  pinType: string;
}

export function PopupTypeIcon({ pinType }: PopupTypeIconProps) {
  const config = pinTypeConfig[pinType as PinType];

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-sm flex-shrink-0"
      style={{
        backgroundColor: `${config.color}20`,
        border: `2px solid ${config.color}`,
      }}
    >
      <span className="text-lg" style={{ color: config.color }}>
        {getPinEmoji(pinType as PinType)}
      </span>
    </div>
  );
}

interface PopupTitleDisplayProps {
  title: string;
  pinType: string;
  onEdit: () => void;
}

export function PopupTitleDisplay({ title, pinType, onEdit }: PopupTitleDisplayProps) {
  const config = pinTypeConfig[pinType as PinType];

  return (
    <div
      className="group cursor-pointer"
      onClick={onEdit}
      title="Click to edit title"
    >
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-accent-gold transition-colors">
        {title}
      </h3>
      <p
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: config.color }}
      >
        {config.label}
      </p>
    </div>
  );
}

interface PopupTitleEditProps {
  editedTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function PopupTitleEdit({
  editedTitle,
  inputRef,
  onTitleChange,
  onSave,
  onCancel,
  onKeyDown,
}: PopupTitleEditProps) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Input
        ref={inputRef}
        type="text"
        value={editedTitle}
        onChange={(e) => {
          e.stopPropagation();
          onTitleChange(e.target.value);
        }}
        onKeyDown={onKeyDown}
        className="flex-1 text-lg font-semibold"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onSave();
        }}
        className="flex-shrink-0 text-green-600 hover:text-green-700"
        title="Save"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
        className="flex-shrink-0 text-red-600 hover:text-red-700"
        title="Cancel"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
