"use client";

import { useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { type ToastState } from "@/shared/hooks/use-toast";

interface ToastProps {
  toast: ToastState;
  onHide: () => void;
}

export function Toast({ toast, onHide }: ToastProps) {
  useEffect(() => {
    // Add animation class on mount
    const toastElement = document.getElementById("toast-notification");
    if (toastElement) {
      toastElement.classList.add("animate-in", "slide-in-from-top");
    }
  }, []);

  const Icon = toast.type === "success" ? Check : AlertCircle;

  return (
    <div
      id="toast-notification"
      className="fixed top-4 right-4 z-[9999] min-w-80 max-w-3/5 animate-in fade-in duration-200"
    >
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-sm border shadow-lg ${
          toast.type === "success"
            ? "bg-emerald-950/90 border-emerald-700/50"
            : "bg-rose-950/90 border-rose-700/50"
        } backdrop-blur-sm`}
      >
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${
            toast.type === "success" ? "text-emerald-400" : "text-rose-400"
          }`}
        />
        <p
          className={`flex-1 text-sm leading-relaxed ${
            toast.type === "success" ? "text-emerald-100" : "text-rose-100"
          }`}
        >
          {toast.message}
        </p>
        <button
          onClick={onHide}
          className={`flex-shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors ${
            toast.type === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toast: ToastState | null;
  onHide: () => void;
}

export function ToastContainer({ toast, onHide }: ToastContainerProps) {
  if (!toast) return null;

  return <Toast toast={toast} onHide={onHide} />;
}
