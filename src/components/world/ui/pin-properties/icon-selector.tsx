import { PIN_ICONS, getUniqueCategories } from "@/constants/pin-icons";
import { isLucideIconName } from "@/lib/icon-utils";
import { ChevronDown, Search, X, Upload, Check, MapPin } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

interface IconSelectorProps {
  currentIcon: string | null;
  isUpdating: boolean;
  onIconSelect: (iconName: string) => void;
  onUploadClick: () => void;
  canUpload: boolean;
}

interface IconWrapperProps {
  iconName: string;
  className?: string;
}

function IconWrapper({ iconName, className }: IconWrapperProps) {
  if (!isLucideIconName(iconName)) {
    return <MapPin className={className} />;
  }

  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} />;
}

function getPinIcon(iconName: string) {
  if (!isLucideIconName(iconName)) {
    return MapPin;
  }
  return LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
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
  const currentIconName = currentIcon || "map-pin";

  const filteredIcons = PIN_ICONS.filter((icon) => {
    const matchesSearch =
      icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50">
      <label className="block text-xs font-display text-bone-dark mb-2 uppercase tracking-wide">Icon</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isUpdating}
          className="w-full flex items-center gap-2 px-3 py-2 rounded bg-void/50 border border-iron/30 hover:border-accent-gold/50 transition-all disabled:opacity-50"
        >
          {isCustomImage ? (
            <img
              src={currentIcon!}
              alt="Custom icon"
              className="w-4 h-4 object-contain"
            />
          ) : (
            <IconWrapper iconName={currentIconName} className="w-4 h-4 text-accent-gold" />
          )}
          <span className="text-sm text-bone flex-1 text-left font-fell">
            {isCustomImage
              ? "Custom Icon"
              : PIN_ICONS.find((i) => i.name === currentIcon)?.label ||
                "Default Icon"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-accent-gold/60 transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {showDropdown && (
          <div className="absolute z-50 mt-2 w-full max-h-80 overflow-y-auto rounded-sm bg-obsidian/95 backdrop-blur-md border border-iron shadow-xl">
            <div className="sticky top-0 bg-obsidian/95 border-b border-iron/50 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-dark" />
                <input
                  id="icon-search"
                  name="iconSearch"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-9 pr-8 py-2 text-sm bg-void/50 border border-iron/30 rounded focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/30 text-bone font-fell"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-bone-dark hover:text-accent-gold transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-2">
              {filteredIcons.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <Search className="w-8 h-8 text-bone-dark/60 mx-auto mb-2" />
                  <p className="text-sm text-bone-dark mb-3 font-fell">
                    No icons found matching &quot;{searchTerm}&quot;
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-xs font-display text-accent-gold hover:underline transition-colors uppercase tracking-wide"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                iconCategories.map((category) => {
                  const categoryIcons = filteredIcons.filter(
                    (i) => i.category === category
                  );
                  if (categoryIcons.length === 0) return null;

                  return (
                    <div key={category} className="mb-3 last:mb-0">
                      <div className="px-2 py-1 text-xs font-display text-accent-gold/80 uppercase tracking-wider sticky top-0 bg-obsidian/95 flex items-center gap-2">
                        <span className="flex-1">{category}</span>
                        <span className="text-accent-gold/30 text-xs">ᛟ</span>
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
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded text-sm transition-all ${
                              isSelected
                                ? "bg-accent-gold/20 text-accent-gold border border-accent-gold/30"
                                : "text-bone hover:bg-void/50"
                            }`}
                          >
                            <IconComponent className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 text-left font-fell">
                              {iconOption.label}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-accent-gold" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-iron/50 p-2">
              <button
                type="button"
                onClick={() => {
                  onUploadClick();
                  setShowDropdown(false);
                }}
                disabled={isUpdating || !canUpload}
                className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-bone-dark hover:bg-accent-gold/10 hover:text-accent-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all font-fell"
              >
                <Upload className="w-4 h-4" />
                <span className="flex-1 text-left">Upload Custom Icon...</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
