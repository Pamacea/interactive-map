import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CATEGORIES } from "./lore-form-fields";
import type { LoreCategory } from "@/types/lore.type";
import { MarkdownEditor } from "./markdown-editor";

interface LoreFormData {
  title: string;
  content: string;
  category: LoreCategory;
  isVisible: boolean;
  isPublic: boolean;
}

interface LoreFormFieldsProps {
  formData: LoreFormData;
  isSubmitting: boolean;
  updateField: <K extends keyof LoreFormData>(field: K, value: LoreFormData[K]) => void;
}

export function LoreFormFields({ formData, isSubmitting, updateField }: LoreFormFieldsProps) {
  return (
    <>
      <LoreFormField
        id="lore-title"
        label="Title"
        required
        value={formData.title}
        onChange={(value) => updateField("title", value)}
        placeholder="Enter title..."
        disabled={isSubmitting}
        maxLength={200}
        showLength
      />

      <LoreFormCategory
        value={formData.category}
        onChange={(value) => updateField("category", value)}
        disabled={isSubmitting}
      />

      <MarkdownEditor
        id="lore-content"
        label="Content"
        required
        value={formData.content}
        onChange={(value) => updateField("content", value)}
        placeholder="Write your lore entry here... (Markdown supported)"
        disabled={isSubmitting}
        maxLength={50000}
        minHeight={200}
        showPreview
      />

      <LoreFormVisibility
        isVisible={formData.isVisible}
        isPublic={formData.isPublic}
        onVisibleChange={(value) => updateField("isVisible", value)}
        onPublicChange={(value) => updateField("isPublic", value)}
        disabled={isSubmitting}
      />
    </>
  );
}

interface LoreFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
  maxLength: number;
  rows?: number;
  isTextarea?: boolean;
  showLength?: boolean;
}

function LoreFormField({
  id,
  label,
  required,
  value,
  onChange,
  placeholder,
  disabled,
  maxLength,
  rows,
  isTextarea,
  showLength,
}: LoreFormFieldProps) {
  const InputComponent = isTextarea ? Textarea : Input;

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <InputComponent
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={isTextarea ? "resize-y" : undefined}
      />
      {showLength && (
        <p className="text-xs text-text-muted">
          {value.length} / {maxLength.toLocaleString()} characters
        </p>
      )}
    </div>
  );
}

interface LoreFormCategoryProps {
  value: string;
  onChange: (value: any) => void;
  disabled: boolean;
}

function LoreFormCategory({ value, onChange, disabled }: LoreFormCategoryProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="lore-category">Category</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="lore-category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface LoreFormVisibilityProps {
  isVisible: boolean;
  isPublic: boolean;
  onVisibleChange: (value: boolean) => void;
  onPublicChange: (value: boolean) => void;
  disabled: boolean;
}

function LoreFormVisibility({
  isVisible,
  isPublic,
  onVisibleChange,
  onPublicChange,
  disabled,
}: LoreFormVisibilityProps) {
  return (
    <div className="flex gap-4">
      <CheckboxField
        id="lore-visible"
        label="Visible in map"
        checked={isVisible}
        onChange={onVisibleChange}
        disabled={disabled}
      />
      <CheckboxField
        id="lore-public"
        label="Public"
        checked={isPublic}
        onChange={onPublicChange}
        disabled={disabled}
      />
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

function CheckboxField({ id, label, checked, onChange, disabled }: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
        disabled={disabled}
      />
      <Label htmlFor={id} className="cursor-pointer text-text-secondary">
        {label}
      </Label>
    </div>
  );
}
