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
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <label className="block text-xs text-text-muted mb-1.5">
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
        className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none resize-none disabled:opacity-50"
        placeholder="Enter pin description..."
        maxLength={5000}
      />
    </div>
  );
}
