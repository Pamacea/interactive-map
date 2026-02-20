"use client";

import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCreatePin } from "@/features/pins/store";
import { usePinForm } from "../logic/use-pin-form";
import { PinForm } from "./pin-form";
import { useToast } from "@/shared/hooks/use-toast";
import { PinType } from "@/types/pin.type";

interface FormLayer {
  id: string;
  name: string;
}

interface PinCreateFormProps {
  worldId: string;
  layers?: FormLayer[];
  initialLat?: number;
  initialLng?: number;
  initialLayerId?: string;
  initialPinType?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function PinCreateForm({
  worldId,
  layers = [],
  initialLat,
  initialLng,
  initialLayerId,
  initialPinType,
  onSuccess,
  onClose,
}: PinCreateFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const { toast, showToast } = useToast();

  const form = usePinForm({
    mode: "create",
    worldId,
    initialData: {
      latitude: initialLat || 0,
      longitude: initialLng || 0,
      layerId: initialLayerId || "",
      pinType: (initialPinType as (typeof PinType)[keyof typeof PinType]) || PinType.CUSTOM,
    },
  });

  const createPinMutation = useCreatePin();
  const [isCreating, setIsCreating] = useState(false);

  // Auto-focus title field when form opens
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.validate()) {
      return;
    }

    setIsCreating(true);

    try {
      const data = form.getSubmitData();
      await createPinMutation(data as any);
      showToast("Pin created successfully!", "success");
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An unexpected error occurred", "error");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm border shadow-lg ${
            toast.type === "success"
              ? "bg-status-success/20 border-status-success text-status-success"
              : "bg-status-error/20 border-status-error text-status-error"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg className="w-5 h-5" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <PinForm
        formData={form.formData}
        errors={form.errors}
        onUpdateField={form.updateField}
        layers={layers}
        mode="create"
        showLayer={layers.length > 0}
        isSubmitting={isCreating}
        onSubmit={handleSubmit}
        onCancel={onClose}
        titleRef={titleRef}
      />
    </>
  );
}
