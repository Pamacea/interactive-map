"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings as SettingsIcon, Bell, Lock, Globe } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-base">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-background-card rounded-xl border border-border-subtle p-6">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">General Settings</h2>
            </div>
            <p className="text-text-muted">General application settings will be available here.</p>
          </div>

          <div className="bg-background-card rounded-xl border border-border-subtle p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
            </div>
            <p className="text-text-muted">Notification preferences will be available here.</p>
          </div>

          <div className="bg-background-card rounded-xl border border-border-subtle p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">Privacy</h2>
            </div>
            <p className="text-text-muted">Privacy settings will be available here.</p>
          </div>

          <div className="bg-background-card rounded-xl border border-border-subtle p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-accent-gold" />
              <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>
            </div>
            <p className="text-text-muted">Appearance settings will be available here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
