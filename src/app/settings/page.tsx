"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings as SettingsIcon, Bell, Lock, Globe, Crown } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { FloatingParticles } from "@/components/ui/particles";

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
      <div className="h-screen flex items-center justify-center bg-void ml-16 sm:ml-20 relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="text-4xl text-accent-gold/30 animate-rune-glow">ᛟ</div>
          <div className="text-bone font-fell">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const settingsOptions = [
    {
      icon: SettingsIcon,
      title: "General",
      description: "Application preferences and configuration",
      rune: "I",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage your notification preferences",
      rune: "II",
    },
    {
      icon: Lock,
      title: "Privacy",
      description: "Control your privacy settings",
      rune: "III",
    },
    {
      icon: Globe,
      title: "Appearance",
      description: "Customize the look and feel",
      rune: "IV",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-void relative overflow-hidden">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        <FloatingParticles />
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <AppHeader />

      <div className="ml-16 sm:ml-20 flex-1 w-full flex flex-col justify-center items-center px-4 pt-24 pb-16 sm:pt-28 sm:pb-20 relative z-10">
        {/* Ornate Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          {/* Gear Icon */}
          <div className="text-4xl sm:text-5xl text-accent-gold/20 mb-4">
            <SettingsIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" strokeWidth={1} />
          </div>

          {/* Decorative Line with Rune */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-accent-gold/50 to-accent-gold" />
            <span className="text-accent-gold-dark opacity-40 text-lg sm:text-xl animate-rune-glow">ᛟ</span>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-accent-gold/50 to-accent-gold" />
          </div>

          <p className="font-display text-xs tracking-[0.4em] text-bone-dark mb-3">
            CONFIGURE YOUR REALM
          </p>
          <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider">
            Settings
          </h1>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {settingsOptions.map((option, index) => (
            <div
              key={index}
              className="group relative bg-obsidian/60 backdrop-blur-sm border border-iron rounded-md p-6 hover:border-accent-gold/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Corner Rune */}
              <span className="absolute top-2 right-2 text-accent-gold-dark opacity-20 text-xs">
                {option.rune}
              </span>

              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                  <option.icon className="w-6 h-6 text-accent-gold" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-lg text-bone">{option.title}</h2>
              </div>
              <p className="font-fell text-sm text-bone-dark pl-16">{option.description}</p>
            </div>
          ))}
        </div>
        
      </div>

      {/* Ornate Divider */}
      <div className="ml-16 sm:ml-20 relative z-10">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
          <span className="text-accent-gold-dark opacity-30">ᛟ</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-accent-gold/30 to-transparent" />
        </div>
        <Footer />
      </div>
    </div>
  );
}
