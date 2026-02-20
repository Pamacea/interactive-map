"use client";

import * as React from "react";
import {
  X,
  Check,
  Search,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import type { IconShape } from "@prisma/client";
import { ICON_SHAPES, PRESET_COLORS, EMOJI_ICONS, LUCIDE_ICONS } from "./icon-data";
import { PinPreview } from "./components/pin-preview";
import { ShapePreview } from "./components/shape-preview";

type IconCategory = "emoji" | "lucide";
type IconType = IconCategory | "custom";

interface PinIconPickerProps {
  pinId: string;
  currentIcon?: string | null;
  currentColor?: string;
  currentShape?: IconShape;
  currentSize?: number;
  currentCustomIcon?: string | null;
  currentIconBackground?: string | null;
  onUpdate: (data: {
    icon?: string;
    color?: string;
    iconShape?: IconShape;
    iconSize?: number;
    customIcon?: string | null;
    iconBackground?: string | null;
  }) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PinIconPicker({
  pinId,
  currentIcon,
  currentColor = "#3b82f6",
  currentShape = "CIRCLE",
  currentSize = 32,
  currentCustomIcon,
  currentIconBackground,
  onUpdate,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PinIconPickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const [selectedShape, setSelectedShape] = React.useState<IconShape>(currentShape);
  const [selectedColor, setSelectedColor] = React.useState(currentColor);
  const [customColor, setCustomColor] = React.useState(currentColor);
  const [iconSize, setIconSize] = React.useState(currentSize);
  const [selectedIcon, setSelectedIcon] = React.useState(currentIcon || "📍");
  const [iconType, setIconType] = React.useState<IconType>("emoji");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Custom icon upload mutations
  const uploadIconMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { uploadCustomPinIcon } = await import("@/features/pins");
      return uploadCustomPinIcon(pinId, formData);
    },
    onSuccess: (result) => {
      if (result.success) {
        onUpdate({
          customIcon: result.data.iconUrl,
          iconShape: "CUSTOM",
        });
        setSelectedShape("CUSTOM");
      }
    },
  });

  const uploadBackgroundMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { uploadCustomPinIcon } = await import("@/features/pins");
      return uploadCustomPinIcon(pinId, formData);
    },
    onSuccess: (result) => {
      if (result.success) {
        onUpdate({
          iconBackground: result.data.iconUrl,
        });
      }
    },
  });

  const handleApply = () => {
    onUpdate({
      icon: selectedIcon,
      color: selectedColor,
      iconShape: selectedShape,
      iconSize,
    });
    setOpen(false);
  };

  const handleShapeSelect = (shape: IconShape) => {
    setSelectedShape(shape);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleIconFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadIconMutation.mutate(file);
    }
  };

  const handleBackgroundFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadBackgroundMutation.mutate(file);
    }
  };

  // Filter emojis based on search
  const filteredEmojis = React.useMemo(() => {
    if (!searchQuery) return EMOJI_ICONS;
    const query = searchQuery.toLowerCase();
    const filtered: typeof EMOJI_ICONS = {
      locations: [],
      combat: [],
      items: [],
      nature: [],
      creatures: [],
      misc: [],
    };
    Object.entries(EMOJI_ICONS).forEach(([category, emojis]) => {
      filtered[category as keyof typeof filtered] = emojis.filter((emoji) =>
        emoji.includes(query) || category.includes(query)
      );
    });
    return filtered;
  }, [searchQuery]);

  // Filter Lucide icons based on search
  const filteredLucideIcons = React.useMemo(() => {
    const icons = Object.keys(LUCIDE_ICONS);
    if (!searchQuery) return icons;
    return icons.filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  // Determine current icon type
  React.useEffect(() => {
    if (currentCustomIcon) {
      setIconType("custom");
    } else if (currentIcon?.startsWith("lucide:")) {
      setIconType("lucide");
    } else {
      setIconType("emoji");
    }
  }, [currentCustomIcon, currentIcon]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="bg-obsidian border border-border-subtle max-w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Customize Pin Icon</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Choose shape, color, size, icon, or upload custom assets for this pin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Preview */}
          <div className="flex items-center justify-center p-6 bg-black/30 rounded-sm border border-border-subtle">
            <PinPreview
              icon={selectedIcon}
              color={selectedColor}
              shape={selectedShape}
              size={iconSize}
              customIcon={selectedShape === "CUSTOM" ? currentCustomIcon : undefined}
              iconBackground={currentIconBackground}
            />
          </div>

          {/* Shape Selection */}
          <section>
            <Label className="text-text-primary mb-3 block">Shape</Label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(ICON_SHAPES).map(([key, { name }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleShapeSelect(key as IconShape)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-sm border-2 transition-all",
                    "hover:bg-accent-gold/10",
                    selectedShape === key
                      ? "border-accent-gold bg-accent-gold/20"
                      : "border-border-subtle"
                  )}
                >
                  <ShapePreview shape={key as IconShape} color={selectedColor} />
                  <span className="text-xs text-text-secondary">{name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Color Selection */}
          <section>
            <Label className="text-text-primary mb-3 block">Color</Label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorSelect(color.value)}
                  className={cn(
                    "w-full aspect-square rounded-sm border-2 transition-all",
                    "hover:scale-110",
                    selectedColor === color.value
                      ? "border-white ring-2 ring-accent-gold/50"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    setSelectedColor(e.target.value);
                  }
                }}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </section>

          {/* Size Slider */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-text-primary">Size</Label>
              <span className="text-xs text-text-muted">{iconSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="64"
              value={iconSize}
              onChange={(e) => setIconSize(parseInt(e.target.value))}
              className="w-full h-2 bg-obsidian rounded-lg appearance-none cursor-pointer accent-accent-gold"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>12px</span>
              <span>64px</span>
            </div>
          </section>

          {/* Icon Selection - Only show for non-CUSTOM shapes */}
          {selectedShape !== "CUSTOM" && (
            <IconSelectionSection
              iconType={iconType}
              setIconType={setIconType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredEmojis={filteredEmojis}
              filteredLucideIcons={filteredLucideIcons}
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
            />
          )}

          {/* Custom Icon Upload */}
          {selectedShape === "CUSTOM" && (
            <section>
              <Label className="text-text-primary mb-3 block">Custom Icon</Label>
              <div className="flex items-center gap-3">
                {currentCustomIcon && (
                  <div className="w-12 h-12 rounded-sm border border-border-subtle flex items-center justify-center bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentCustomIcon}
                      alt="Custom icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/png,image/webp,image/svg+xml,image/jpeg"
                    onChange={handleIconFileSelect}
                    disabled={uploadIconMutation.isPending}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    PNG, WebP, SVG up to 2MB
                  </p>
                </div>
                {currentCustomIcon && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onUpdate({ customIcon: null })}
                    className="h-8 w-8 text-text-muted hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {uploadIconMutation.isPending && (
                <p className="text-xs text-accent-gold mt-2">Uploading icon...</p>
              )}
            </section>
          )}

          {/* Custom Background Upload */}
          <section>
            <Label className="text-text-primary mb-3 block">Custom Icon Background</Label>
            <div className="flex items-center gap-3">
              {currentIconBackground && (
                <div className="w-12 h-12 rounded-sm border border-border-subtle flex items-center justify-center bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentIconBackground}
                    alt="Custom background"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/png,image/webp,image/svg+xml,image/jpeg"
                  onChange={handleBackgroundFileSelect}
                  disabled={uploadBackgroundMutation.isPending}
                  className="cursor-pointer"
                />
                <p className="text-xs text-text-muted mt-1">
                  PNG, WebP, SVG up to 2MB (optional)
                </p>
              </div>
              {currentIconBackground && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdate({ iconBackground: null })}
                  className="h-8 w-8 text-text-muted hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {uploadBackgroundMutation.isPending && (
              <p className="text-xs text-accent-gold mt-2">Uploading background...</p>
            )}
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-subtle">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-text-muted"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface IconSelectionSectionProps {
  iconType: IconType;
  setIconType: (type: IconType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredEmojis: typeof EMOJI_ICONS;
  filteredLucideIcons: string[];
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
}

function IconSelectionSection({
  iconType,
  setIconType,
  searchQuery,
  setSearchQuery,
  filteredEmojis,
  filteredLucideIcons,
  selectedIcon,
  setSelectedIcon,
}: IconSelectionSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-text-primary">Icon</Label>
        {/* Icon Type Toggle */}
        <div className="flex rounded-sm border border-border-subtle overflow-hidden">
          <button
            type="button"
            onClick={() => setIconType("emoji")}
            className={cn(
              "px-3 py-1 text-xs transition-colors",
              iconType === "emoji"
                ? "bg-accent-gold/20 text-accent-gold"
                : "bg-obsidian text-text-muted hover:text-text-primary"
            )}
          >
            Emoji
          </button>
          <button
            type="button"
            onClick={() => setIconType("lucide")}
            className={cn(
              "px-3 py-1 text-xs transition-colors border-l border-border-subtle",
              iconType === "lucide"
                ? "bg-accent-gold/20 text-accent-gold"
                : "bg-obsidian text-text-muted hover:text-text-primary"
            )}
          >
            Lucide
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          type="text"
          placeholder="Search icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-obsidian border border-border-subtle"
        />
      </div>

      {/* Emoji Icons */}
      {iconType === "emoji" && (
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {Object.entries(filteredEmojis).map(
            ([category, emojis]) =>
              emojis.length > 0 && (
                <div key={category}>
                  <p className="text-xs text-text-muted capitalize mb-2">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedIcon(emoji)}
                        className={cn(
                          "w-10 h-10 text-xl rounded-sm border-2 flex items-center justify-center transition-all hover:scale-110",
                          selectedIcon === emoji
                            ? "border-accent-gold bg-accent-gold/20"
                            : "border-border-subtle"
                        )}
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {/* Lucide Icons */}
      {iconType === "lucide" && (
        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-black/20 rounded-sm">
          {filteredLucideIcons.map((iconName) => {
            const IconComponent =
              LUCIDE_ICONS[iconName as keyof typeof LUCIDE_ICONS];
            const iconValue = `lucide:${iconName}`;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setSelectedIcon(iconValue)}
                className={cn(
                  "w-10 h-10 rounded-sm border-2 flex items-center justify-center transition-all hover:scale-110",
                  selectedIcon === iconValue
                    ? "border-accent-gold bg-accent-gold/20 text-accent-gold"
                    : "border-border-subtle text-text-muted hover:text-text-primary"
                )}
                title={iconName}
              >
                <IconComponent className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
