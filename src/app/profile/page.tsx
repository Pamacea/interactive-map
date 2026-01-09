"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { User, Mail, Shield, Map, Settings, Sparkles } from "lucide-react";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/home/ui/footer";

export default function ProfilePage() {
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
      <div className="flex-1 max-w-1/3 mx-auto px-4 py-40">
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-3xl font-bold text-background-base">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{session.user.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary mb-1">
                {session.user.name || "User"}
              </h1>
              <p className="text-text-secondary">{session.user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/worlds"
            className="group bg-background-card hover:bg-background-elevated rounded-xl border border-border-subtle p-6 transition-all duration-200 hover:shadow-lg hover:border-accent-gold"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <Sparkles className="w-6 h-6 text-accent-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">My Worlds</h3>
                <p className="text-sm text-text-muted">Manage your created worlds</p>
              </div>
            </div>
          </Link>

          <Link
            href="/settings"
            className="group bg-background-card hover:bg-background-elevated rounded-xl border border-border-subtle p-6 transition-all duration-200 hover:shadow-lg hover:border-accent-gold"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-12 rounded-lg bg-accent-gold/10 flex items-center justify-center group-hover:bg-accent-gold/20 transition-colors">
                <Settings className="w-6 h-6 text-accent-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">Settings</h3>
                <p className="text-sm text-text-muted">Customize your experience now</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-background-card rounded-xl border border-border-subtle p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Account Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-text-muted mt-1" />
              <div>
                <p className="text-sm text-text-muted mb-1">Display Name</p>
                <p className="text-text-primary">{session.user.name || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-text-muted mt-1" />
              <div>
                <p className="text-sm text-text-muted mb-1">Email Address</p>
                <p className="text-text-primary">{session.user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-text-muted mt-1" />
              <div>
                <p className="text-sm text-text-muted mb-1">Account Role</p>
                <p className="text-text-primary capitalize">{session.user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
