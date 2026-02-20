"use client";

import { ToastContainer } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastDisplay />
    </>
  );
}

function ToastDisplay() {
  const { toast, hideToast } = useToast();

  return <ToastContainer toast={toast} onHide={hideToast} />;
}
