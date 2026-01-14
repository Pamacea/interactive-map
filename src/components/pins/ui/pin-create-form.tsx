"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { usePins } from "../logic/use-pins";
import { usePinForm } from "../logic/use-pin-form";
import { PinForm } from "./pin-form";
import { useToast } from "@/hooks/use-toast";

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
      pinType: initialPinType as any,
    },
  });

  const { createPin, isCreating } = usePins(worldId);

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

    try {
      const data = form.getSubmitData();
      createPin(data as any, {
        onSuccess: () => {
          showToast("Pin created successfully!", "success");
          onSuccess?.();
        },
        onError: (error: Error) => {
          showToast(error.message || "Failed to create pin", "error");
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An unexpected error occurred", "error");
      }
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
