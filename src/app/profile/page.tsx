"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Shield } from "lucide-react";

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
        <div className="bg-background-card rounded-2xl border border-border-subtle p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Profile</h1>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-2xl font-bold text-background-base">
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
                <h2 className="text-xl font-semibold text-text-primary">
                  {session.user.name || "User"}
                </h2>
                <p className="text-text-muted">{session.user.email}</p>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Name</p>
                    <p className="text-text-primary">{session.user.name || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Email</p>
                    <p className="text-text-primary">{session.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-text-muted" />
                  <div>
                    <p className="text-sm text-text-muted">Role</p>
                    <p className="text-text-primary capitalize">{session.user.role.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
