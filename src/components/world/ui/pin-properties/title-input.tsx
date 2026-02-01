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
    <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50">
      <label className="block text-xs font-display text-bone-dark mb-2 uppercase tracking-wide">Title</label>
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
            onChange(externalValue);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          } else if (e.key === "Escape") {
            onChange(externalValue);
            e.currentTarget.blur();
          }
        }}
        disabled={disabled}
        className="w-full bg-void/50 border border-iron/30 rounded px-3 py-2 text-sm text-bone placeholder:text-bone-dark/40 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/30 transition-all disabled:opacity-50 font-fell"
        placeholder="Enter pin title..."
        maxLength={200}
      />
    </div>
  );
}
