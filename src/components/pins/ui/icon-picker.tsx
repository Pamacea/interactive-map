"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"
import { getLucideIconNames, getLucideIcon } from "@/lib/icon-utils"
import { useFocusTrap, useFocusReturn } from "@/hooks/accessibility"

interface IconPickerProps {
  onSelect: (iconName: string) => void
  onClose: () => void
  currentIcon?: string
}

// Get all Lucide icon COMPONENTS (type-safe)
const iconNames = getLucideIconNames()

export function IconPicker({ onSelect, onClose, currentIcon }: IconPickerProps) {
  const [search, setSearch] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const filteredIcons = React.useMemo(() => {
    if (!search) return iconNames
    return iconNames.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  // Reset selected index when search changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Focus management
  useFocusReturn(true)
  useFocusTrap(true, dialogRef as React.RefObject<HTMLElement>)

  // Close on Escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredIcons.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredIcons.length) % filteredIcons.length)
        break
      case "Enter":
        e.preventDefault()
        if (filteredIcons[selectedIndex]) {
          onSelect(filteredIcons[selectedIndex])
          onClose()
        }
        break
      case "Escape":
        e.preventDefault()
        onClose()
        break
    }
  }

  const IconComponent = (iconName: string) => {
    const Icon = getLucideIcon(iconName)
    try {
      return <Icon className="w-6 h-6" aria-hidden="true" />
    } catch (error) {
      console.error(`Failed to render icon: ${iconName}`, error)
      return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="icon-picker-title"
        aria-describedby="icon-picker-description"
        className="relative bg-background-card border-2 border-accent-gold rounded-sm shadow-2xl w-full max-h-[80vh] flex flex-col z-50"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-ornate)] p-4">
          <h2 id="icon-picker-title" className="text-lg font-semibold text-text-primary">
            Select Icon
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-accent-gold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 rounded-sm p-1"
            aria-label="Close icon picker"
            type="button"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--color-border-ornate)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
            <label htmlFor="icon-search" className="sr-only">
              Search icons
            </label>
            <input
              id="icon-search"
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full pl-10 pr-4 py-2 bg-background-base border border-border-ornate rounded-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
              autoFocus
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div
          id="icon-picker-description"
          className="flex-1 overflow-y-auto p-4"
          role="region"
          aria-label={`Icon grid, ${filteredIcons.length} icons available`}
        >
          {filteredIcons.length === 0 ? (
            <div className="text-center text-text-muted py-8" role="status">
              No icons found matching "{search}"
            </div>
          ) : (
            <div
              role="listbox"
              aria-label="Available icons"
              aria-activedescendant={filteredIcons[selectedIndex] ? `icon-${selectedIndex}` : undefined}
              className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2"
            >
              {filteredIcons.map((iconName, index) => {
                const isSelected = index === selectedIndex
                const isCurrent = iconName === currentIcon

                return (
                  <button
                    key={iconName}
                    id={`icon-${index}`}
                    role="option"
                    aria-selected={isSelected && isCurrent}
                    aria-label={`${iconName}${isCurrent ? " (current icon)" : ""}`}
                    onClick={() => {
                      onSelect(iconName)
                      onClose()
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-sm border-2 transition-all",
                      "hover:bg-accent-gold/10 hover:border-accent-gold/50",
                      "focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
                      isSelected && "bg-accent-gold/20 border-accent-gold",
                      isCurrent && "bg-blue-500/20 border-blue-500"
                    )}
                    type="button"
                  >
                    {IconComponent(iconName)}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-border-ornate)] p-4 text-xs text-text-muted" role="status">
          {filteredIcons.length} icon{filteredIcons.length !== 1 ? "s" : ""} • Use arrow keys to navigate, Enter to select, Escape to close
        </div>
      </div>
    </div>
  )
}
