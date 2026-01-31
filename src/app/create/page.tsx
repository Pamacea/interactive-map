import { GridBackground } from "@/components/ui/grid-background";
import { FloatingParticles } from "@/components/ui/particles";
import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { CreateWorldForm } from "@/components/create/ui";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackground />
        <FloatingParticles />
      </div>

      <AppHeader />

      <div className="relative z-10 ml-16 sm:ml-20 min-h-screen flex flex-col">
        <main className="flex-1 px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3/5 mx-auto">
            {/* Header */}
            <div className="mb-8 sm:mb-12">
              <p className="font-display text-xs tracking-[0.3em] text-bone-dark mb-3">
                FORGE YOUR LEGACY
              </p>
              <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider mb-4">
                Create New World
              </h1>
              <p className="font-fell text-bone-dark text-lg">
                Start building your interactive fantasy map
              </p>
            </div>

            <CreateWorldForm />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
