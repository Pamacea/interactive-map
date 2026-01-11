import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const worlds = await prisma.gameWorld.findMany({
    include: {
      _count: {
        select: {
          pins: true,
          loreEntries: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(worlds);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, isPublic, map } = body;

  const user = await prisma.user.findFirst({
    where: { email: "user@example.com" },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const world = await prisma.gameWorld.create({
    data: {
      title,
      description,
      isPublic,
      map,
      userId: user.id,
      isPublished: true,
    },
  });

  return NextResponse.json(world);
}
