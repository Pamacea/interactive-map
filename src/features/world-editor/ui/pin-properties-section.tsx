import { IconUploadDialog } from "./icon-upload-dialog";
import type { Pin } from "@prisma/client";
import { useState } from "react";
import {
  ErrorAlert,
  UpdatingIndicator,
  SectionHeader,
  TitleInput,
  DescriptionTextarea,
  PinTypeSelect,
  IconSelector,
  SizeSlider,
  ColorPicker,
  OpacitySlider,
  ZoomRangeSection,
  VisibilityToggle,
  CoordinatesDisplay,
} from "./pin-properties";
import { usePinPropertiesForm } from "../logic/use-pin-properties-form";

interface PinPropertiesSectionProps {
  pin: Pin;
  formState: {
    title: string;
    description: string;
    pinType: Pin["pinType"];
    icon: string | null;
    size: number;
    color: string;
    opacity: number;
    isVisible: boolean;
    minZoom: number;
    maxZoom: number;
  };
  isUpdating: boolean;
  error?: string | null;
  onUpdate: <K extends keyof Pin>(field: K, value: Pin[K]) => void;
  onIconUpload?: (file: File) => Promise<void>;
  onRetry?: () => void;
}

export function PinPropertiesSection({
  pin,
  formState,
  isUpdating,
  error,
  onUpdate,
  onIconUpload,
  onRetry,
}: PinPropertiesSectionProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const {
    localTitle,
    localDescription,
    handleTitleUpdate,
    handleDescriptionUpdate,
    resetZoom,
  } = usePinPropertiesForm({ formState });

  return (
    <section className="space-y-3">
      {error && <ErrorAlert error={error} onRetry={onRetry} />}

      {isUpdating && !error && <UpdatingIndicator />}

      <SectionHeader pinType={pin.pinType} />

      <div className="space-y-3">
        <TitleInput
          value={localTitle}
          externalValue={formState.title}
          disabled={isUpdating}
          onUpdate={(value) => onUpdate("title", value)}
          onChange={handleTitleUpdate}
        />

        <DescriptionTextarea
          value={localDescription}
          externalValue={formState.description}
          disabled={isUpdating}
          onUpdate={(value) => onUpdate("description", value)}
          onChange={handleDescriptionUpdate}
        />

        <PinTypeSelect
          value={formState.pinType}
          disabled={isUpdating}
          onUpdate={(value) => onUpdate("pinType", value)}
        />

        <IconSelector
          currentIcon={formState.icon}
          isUpdating={isUpdating}
          onIconSelect={(iconName) => onUpdate("icon", iconName)}
          onUploadClick={() => setShowUploadDialog(true)}
          canUpload={!!onIconUpload}
        />

        <SizeSlider
          value={formState.size}
          disabled={isUpdating}
          onUpdate={(value) => onUpdate("size", value)}
        />

        <ColorPicker
          value={formState.color}
          disabled={isUpdating}
          onUpdate={(value) => onUpdate("color", value)}
        />

        <OpacitySlider
          value={formState.opacity}
          disabled={isUpdating}
          onUpdate={(value) => onUpdate("opacity", value)}
        />

        <ZoomRangeSection
          minZoom={formState.minZoom}
          maxZoom={formState.maxZoom}
          disabled={isUpdating}
          onUpdateMinZoom={(value) => onUpdate("minZoom", value)}
          onUpdateMaxZoom={(value) => onUpdate("maxZoom", value)}
          onReset={() => {
            const defaults = resetZoom();
            onUpdate("minZoom", defaults.minZoom);
            onUpdate("maxZoom", defaults.maxZoom);
          }}
        />

        <VisibilityToggle
          isVisible={formState.isVisible}
          disabled={isUpdating}
          onUpdate={(value) => onUpdate("isVisible", value)}
        />

        <CoordinatesDisplay pin={pin} />
      </div>

      {onIconUpload && (
        <IconUploadDialog
          isOpen={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          onUpload={onIconUpload}
          pinId={pin.id}
        />
      )}
    </section>
  );
}
