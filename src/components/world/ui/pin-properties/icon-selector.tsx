import { PIN_ICONS, getUniqueCategories } from "@/constants/pin-icons";
import * as PinIcons from "lucide-react";
import { useState } from "react";

interface IconSelectorProps {
  currentIcon: string | null;
  isUpdating: boolean;
  onIconSelect: (iconName: string) => void;
  onUploadClick: () => void;
  canUpload: boolean;
}

export function IconSelector({
  currentIcon,
  isUpdating,
  onIconSelect,
  onUploadClick,
  canUpload,
}: IconSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const iconCategories = getUniqueCategories();
  const isCustomImage = currentIcon?.startsWith("/");

  const getPinIcon = (iconName: string) => {
    const IconComponent = (PinIcons as any)[iconName];
    return IconComponent ? IconComponent : PinIcons.MapPin;
  };

  const CurrentIconComponent = getPinIcon(currentIcon || "map-pin");

  const filteredIcons = PIN_ICONS.filter((icon) => {
    const matchesSearch =
      icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <label className="block text-xs text-text-muted mb-1.5">Icon</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isUpdating}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-background-base border border-border-subtle hover:border-accent-gold/50 transition-colors disabled:opacity-50"
        >
          {isCustomImage ? (
            <img
              src={currentIcon!}
              alt="Custom icon"
              className="w-4 h-4 object-contain"
            />
          ) : (
            <CurrentIconComponent className="w-4 h-4 text-accent-gold" />
          )}
          <span className="text-sm text-text-primary flex-1 text-left">
            {isCustomImage
              ? "Custom Icon"
              : PIN_ICONS.find((i) => i.name === currentIcon)?.label ||
                "Default Icon"}
          </span>
          <PinIcons.ChevronDown
            className={`w-4 h-4 text-text-muted transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {showDropdown && (
          <div className="absolute z-50 mt-2 w-full max-h-80 overflow-y-auto rounded-lg bg-background-elevated border border-border-subtle shadow-lg">
            <div className="sticky top-0 bg-background-elevated border-b border-border-subtle p-2">
              <div className="relative">
                <PinIcons.Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-8 pr-8 py-1.5 text-sm bg-background-base border border-border-subtle rounded focus:outline-none focus:ring-1 focus:ring-accent-gold/50"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    title="Clear search"
                  >
                    <PinIcons.X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-1">
              {filteredIcons.length === 0 ? (
                <div className="px-2 py-8 text-center">
                  <PinIcons.Search className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-text-muted mb-3">
                    No icons found matching "{searchTerm}"
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-accent-gold hover:underline transition-colors"
                  >
                    Clear search to see all icons
                  </button>
                </div>
              ) : (
                iconCategories.map((category) => {
                  const categoryIcons = filteredIcons.filter(
                    (i) => i.category === category
                  );
                  if (categoryIcons.length === 0) return null;

                  return (
                    <div key={category} className="mb-2">
                      <div className="px-2 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider sticky top-0 bg-background-elevated">
                        {category}
                      </div>
                      {categoryIcons.map((iconOption) => {
                        const IconComponent = getPinIcon(iconOption.name);
                        const isSelected = currentIcon === iconOption.name;

                        return (
                          <button
                            key={iconOption.name}
                            type="button"
                            onClick={() => {
                              onIconSelect(iconOption.name);
                              setShowDropdown(false);
                              setSearchTerm("");
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                              isSelected
                                ? "bg-accent-gold/20 text-accent-gold"
                                : "text-text-primary hover:bg-background-base"
                            }`}
                          >
                            <IconComponent className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 text-left">
                              {iconOption.label}
                            </span>
                            {isSelected && (
                              <PinIcons.Check className="w-4 h-4 text-accent-gold" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-border-subtle p-1">
              <button
                type="button"
                onClick={() => {
                  onUploadClick();
                  setShowDropdown(false);
                }}
                disabled={isUpdating || !canUpload}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-text-secondary hover:bg-background-base hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PinIcons.Upload className="w-4 h-4" />
                <span className="flex-1 text-left">Upload Custom...</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
