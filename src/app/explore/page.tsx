import { GridBackground } from "@/components/ui/grid-background";
import { FloatingParticles } from "@/components/ui/particles";
import { NavigationBar } from "@/components/ui/navigation-bar";
import { ExploreHeader } from "@/components/explore/ui/explore-header";
import { FilterSidebar } from "@/components/explore/ui/filter-sidebar";
import { ResultsHeader } from "@/components/explore/ui/results-header";
import { WorldsGrid } from "@/components/explore/ui/worlds-grid";
import { Footer } from "@/components/home/ui/footer";
import { ExploreClient } from "./explore-client";
import { getAllWorlds } from "@/actions/worlds";

export default async function ExplorePage() {
  const allWorlds = await getAllWorlds();

  return (
    <div className="min-h-screen bg-background-base relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackground />
        <FloatingParticles />
      </div>

      <div className="relative z-10 flex flex-col">
        <NavigationBar />
        <ExploreClient initialWorlds={allWorlds} />
        <Footer />
      </div>
    </div>
  );
}
