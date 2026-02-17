import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-helpers";
import { z } from "zod";

// Validation schema for world creation
const CreateWorldSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  isPublic: z.boolean().default(false),
  map: z.string().optional(),
});

/**
 * GET /api/worlds
 * Returns worlds accessible to the authenticated user:
 * - User's own worlds
 * - Worlds where user is a member
 * - Public worlds
 */
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    const worlds = await prisma.gameWorld.findMany({
      where: {
        OR: [
          { userId: user.id },
          { isPublic: true },
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
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
  } catch (error) {
    // User not authenticated
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/worlds
 * Creates a new world for the authenticated user
 */
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();

    const body = await req.json();
    const validationResult = CreateWorldSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, description, isPublic, map } = validationResult.data;

    const world = await prisma.gameWorld.create({
      data: {
        title,
        description,
        isPublic,
        map,
        userId: user.id,
        isPublished: true,
        // Automatically create OWNER member record
        members: {
          create: {
            userId: user.id,
            permission: "OWNER",
          },
        },
      },
    });

    return NextResponse.json(world);
  } catch (error) {
    // User not authenticated
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
