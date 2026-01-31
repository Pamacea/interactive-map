import { GridBackground } from "@/components/ui/grid-background";
import { FloatingParticles } from "@/components/ui/particles";
import { AppHeader } from "@/components/ui/app-header";
import { Footer } from "@/components/home/ui/footer";
import { ExploreClient } from "./explore-client";
import { getAllWorlds } from "@/actions/worlds";

export default async function ExplorePage() {
  const allWorlds = await getAllWorlds();

  return (
    <div className="min-h-screen bg-void relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackground />
        <FloatingParticles />
      </div>

      <AppHeader />

      <div className="relative z-10 ml-16 sm:ml-20 min-h-screen flex flex-col">
        <ExploreClient initialWorlds={allWorlds} />
        <Footer />
      </div>
    </div>
  );
}
