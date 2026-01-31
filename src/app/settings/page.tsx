"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings as SettingsIcon, Bell, Lock, Globe } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
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
      <div className="h-screen flex items-center justify-center bg-void ml-16 sm:ml-20">
        <div className="text-bone font-fell">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-void">
      <AppHeader />

      <div className="ml-16 sm:ml-20 flex-1 max-w-3/5 px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-display text-xs tracking-[0.3em] text-bone-dark mb-3">
            CONFIGURE YOUR REALM
          </p>
          <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider">
            Settings
          </h1>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-obsidian border border-iron rounded-sm p-6 hover:border-accent-gold/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <SettingsIcon className="w-6 h-6 text-accent-gold" />
              <h2 className="font-display text-lg text-bone">General</h2>
            </div>
            <p className="font-fell text-sm text-bone-dark">Application preferences and configuration</p>
          </div>

          <div className="bg-obsidian border border-iron rounded-sm p-6 hover:border-accent-gold/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-6 h-6 text-accent-gold" />
              <h2 className="font-display text-lg text-bone">Notifications</h2>
            </div>
            <p className="font-fell text-sm text-bone-dark">Manage your notification preferences</p>
          </div>

          <div className="bg-obsidian border border-iron rounded-sm p-6 hover:border-accent-gold/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-accent-gold" />
              <h2 className="font-display text-lg text-bone">Privacy</h2>
            </div>
            <p className="font-fell text-sm text-bone-dark">Control your privacy settings</p>
          </div>

          <div className="bg-obsidian border border-iron rounded-sm p-6 hover:border-accent-gold/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-accent-gold" />
              <h2 className="font-display text-lg text-bone">Appearance</h2>
            </div>
            <p className="font-fell text-sm text-bone-dark">Customize the look and feel</p>
          </div>
        </div>
      </div>

      <div className="ml-16 sm:ml-20">
        <Footer />
      </div>
    </div>
  );
}
