"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/shared/ui/app-header";
import { Footer } from "@/features/home/ui/footer";
import { ToastProvider } from "@/shared/hooks/use-toast";
import { ToastContainer } from "@/shared/ui/toast";
import { useToast } from "@/shared/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { toast, hideToast } = useToast();

  // Determine if we should show header/footer based on route
  const isAuthRoute = pathname?.startsWith("/auth") || pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isEmbedRoute = pathname?.startsWith("/embed");
  const isWorldEditorRoute = pathname?.startsWith("/world/");
  const showChrome = !isAuthRoute && !isEmbedRoute && !isWorldEditorRoute;

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-background-base">
        {showChrome && <AppHeader />}

        <main
          id="main-content"
          className={`flex-1 ${showChrome ? "pt-0" : ""}`}
        >
          {children}
        </main>

        {showChrome && <Footer />}

        <ToastContainer toast={toast} onHide={hideToast} />
      </div>
    </ToastProvider>
  );
}
