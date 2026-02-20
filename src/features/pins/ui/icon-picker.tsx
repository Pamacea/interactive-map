"use client"

import * as React from "react"
import { getLucideIconNames, getLucideIcon } from "@/shared/lib/icon-utils"
import { useFocusTrap, useFocusReturn } from "@/shared/hooks/accessibility"
import { useIconPickerNavigation } from "../logic/use-icon-picker-navigation"
import { IconPickerHeader, IconPickerSearch, IconPickerFooter } from "./icon-picker-parts"

interface IconPickerProps {
  onSelect: (iconName: string) => void
  onClose: () => void
  currentIcon?: string
}

const iconNames = getLucideIconNames()

export function IconPicker({ onSelect, onClose, currentIcon }: IconPickerProps) {
  const [search, setSearch] = React.useState("")
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const filteredIcons = React.useMemo(() => {
    if (!search) return iconNames
    return iconNames.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleSelectIcon = (index: number) => {
    if (filteredIcons[index]) {
      onSelect(filteredIcons[index])
    }
  }

  const { selectedIndex, setSelectedIndex, handleKeyDown, resetIndex } = useIconPickerNavigation({
    itemsCount: filteredIcons.length,
    onSelect: handleSelectIcon,
    onClose,
  })

  React.useEffect(() => {
    resetIndex()
  }, [search, resetIndex])

  useFocusReturn(true)
  useFocusTrap(true, dialogRef as React.RefObject<HTMLElement>)

  const IconComponent = (iconName: string) => {
    const _Icon = getLucideIcon(iconName)
    try {
      return <_Icon className="w-6 h-6" aria-hidden="true" />
    } catch (error) {
      console.error(`Failed to render icon: ${iconName}`, error)
      return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

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
        <IconPickerHeader onClose={onClose} />
        <IconPickerSearch
          search={search}
          onSearchChange={setSearch}
          inputRef={searchInputRef}
        />

        <IconGrid
          filteredIcons={filteredIcons}
          selectedIndex={selectedIndex}
          currentIcon={currentIcon}
          onSelect={(iconName) => {
            onSelect(iconName)
            onClose()
          }}
          onHover={setSelectedIndex}
          IconComponent={IconComponent}
        />

        <IconPickerFooter filteredCount={filteredIcons.length} />
      </div>
    </div>
  )
}

interface IconGridProps {
  filteredIcons: string[]
  selectedIndex: number
  currentIcon?: string
  onSelect: (iconName: string) => void
  onHover: (index: number) => void
  IconComponent: (name: string) => React.ReactNode
}

function IconGrid({
  filteredIcons,
  selectedIndex,
  currentIcon,
  onSelect,
  onHover,
  IconComponent,
}: IconGridProps) {
  if (filteredIcons.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center text-text-muted py-8" role="status">
          No icons found
        </div>
      </div>
    )
  }

  return (
    <div
      id="icon-picker-description"
      className="flex-1 overflow-y-auto p-4"
      role="region"
      aria-label={`Icon grid, ${filteredIcons.length} icons available`}
    >
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
              onClick={() => onSelect(iconName)}
              onMouseEnter={() => onHover(index)}
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
    </div>
  )
}

