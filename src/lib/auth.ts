import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Helper function to get the current session server-side
 * Compatible with NextAuth v4
 */
export async function auth() {
  return await getServerSession(authOptions);
}
