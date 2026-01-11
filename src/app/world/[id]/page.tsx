import { WorldClient } from "@/components/world/ui/world-client";
import { getWorldById } from "@/actions/worlds";
import { notFound } from "next/navigation";

export default async function WorldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const world = await getWorldById(id);

  if (!world) {
    notFound();
  }

  return <WorldClient world={world} />;
}
