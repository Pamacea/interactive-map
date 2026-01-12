"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings as SettingsIcon, Bell, Lock, Globe } from "lucide-react";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/home/ui/footer";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background-base">
      <NavigationBar />
      <div className="flex-1 max-w-2/3 mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Settings</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-background-card rounded-xl border border-border-subtle p-6 hover:border-accent-gold/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <SettingsIcon className="w-6 h-6 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">General</h2>
            </div>
            <p className="text-sm text-text-muted">Application preferences and configuration</p>
          </div>

          <div className="bg-background-card rounded-xl border border-border-subtle p-6 hover:border-accent-gold/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-6 h-6 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
            </div>
            <p className="text-sm text-text-muted">Manage your notification preferences</p>
          </div>

          <div className="bg-background-card rounded-xl border border-border-subtle p-6 hover:border-accent-gold/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">Privacy</h2>
            </div>
            <p className="text-sm text-text-muted">Control your privacy settings</p>
          </div>

          <div className="bg-background-card rounded-xl border border-border-subtle p-6 hover:border-accent-gold/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>
            </div>
            <p className="text-sm text-text-muted">Customize the look and feel</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
