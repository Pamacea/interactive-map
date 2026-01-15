/**
 * Pin description section with inline editing
 */

import * as React from "react"
import { Pencil, Check, X as XIcon } from "lucide-react"
import type { Pin } from "@prisma/client"

interface PinDescriptionSectionProps {
  pin: Pin
  isEditing: boolean
  editedDesc: string
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onStartEditing: () => void
  onSave: () => void
  onCancel: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onDescChange: (value: string) => void
}

export function PinDescriptionSection({
  pin,
  isEditing,
  editedDesc,
  textareaRef,
  onStartEditing,
  onSave,
  onCancel,
  onKeyDown,
  onDescChange,
}: PinDescriptionSectionProps) {
  return (
    <div>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={editedDesc}
            onChange={(e) => {
              e.stopPropagation()
              onDescChange(e.target.value)
            }}
            onKeyDown={onKeyDown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full min-h-[80px] px-3 py-2 bg-background-base border-2 border-accent-gold rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 resize-y"
            placeholder="Add a description..."
          />
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>Ctrl+Enter to save</span>
            <div className="flex-1" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSave()
              }}
              className="p-1 text-green-600 hover:text-green-700 transition-colors"
              title="Save"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCancel()
              }}
              className="p-1 text-red-600 hover:text-red-700 transition-colors"
              title="Cancel"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="group cursor-pointer rounded-sm p-2 -m-2 transition-colors hover:bg-accent-gold/5"
          onClick={onStartEditing}
        >
          {pin.description ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {pin.description}
            </p>
          ) : (
            <p className="text-sm text-text-muted italic">Click to add description...</p>
          )}
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-accent-gold flex items-center gap-1">
              <Pencil className="h-3 w-3" />
              Edit description
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
