interface DescriptionTextareaProps {
  value: string;
  externalValue: string;
  disabled: boolean;
  onUpdate: (value: string) => void;
  onChange: (value: string) => void;
}

export function DescriptionTextarea({
  value,
  externalValue,
  disabled,
  onUpdate,
  onChange,
}: DescriptionTextareaProps) {
  return (
    <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50">
      <label className="block text-xs font-display text-bone-dark mb-2 uppercase tracking-wide">
        Description
      </label>
      <textarea
        value={value}
        onChange={(e) => {
          const description = e.target.value;
          if (description.length <= 5000) {
            onChange(description);
          }
        }}
        onBlur={() => {
          const trimmedDescription = value.trim();
          if (trimmedDescription !== externalValue) {
            onUpdate(trimmedDescription);
          } else {
            onChange(externalValue);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange(externalValue);
            e.currentTarget.blur();
          }
        }}
        disabled={disabled}
        rows={3}
        className="w-full bg-void/50 border border-iron/30 rounded px-3 py-2 text-sm text-bone placeholder:text-bone-dark/40 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/30 transition-all resize-none disabled:opacity-50 font-fell"
        placeholder="Enter pin description..."
        maxLength={5000}
        data-no-shortcut="true"
      />
    </div>
  );
}
