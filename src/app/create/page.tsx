import { GridBackground } from "@/components/ui/grid-background";
import { FloatingParticles } from "@/components/ui/particles";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { Footer } from "@/components/home/ui/footer";
import { CreateWorldForm } from "@/components/create/ui/create-world-form";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background-base relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackground />
        <FloatingParticles />
      </div>

      <div className="relative z-10 flex flex-col">
        <NavigationBar />

        <main className="flex-1 px-4 py-32">
          <div className="max-w-3/5 mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-display font-semibold text-text-primary mb-3">
                Create New World
              </h1>
              <p className="text-lg text-text-secondary">
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
