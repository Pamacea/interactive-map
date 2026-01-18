interface TitleInputProps {
  value: string;
  externalValue: string;
  disabled: boolean;
  onUpdate: (value: string) => void;
  onChange: (value: string) => void;
}

export function TitleInput({
  value,
  externalValue,
  disabled,
  onUpdate,
  onChange,
}: TitleInputProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <label className="block text-xs text-text-muted mb-1.5">Title</label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const title = e.target.value;
          if (title.length <= 200) {
            onChange(title);
          }
        }}
        onBlur={() => {
          const trimmedTitle = value.trim();
          if (trimmedTitle.length > 0 && trimmedTitle !== externalValue) {
            onUpdate(trimmedTitle);
          } else if (trimmedTitle.length === 0) {
            // Reset to externalValue if empty
            onChange(externalValue);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          } else if (e.key === "Escape") {
            // Reset to externalValue on Escape
            onChange(externalValue);
            e.currentTarget.blur();
          }
        }}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none disabled:opacity-50"
        placeholder="Enter pin title..."
        maxLength={200}
      />
    </div>
  );
}
