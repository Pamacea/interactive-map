
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Logout
export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
}

// Sign in with email and password.
export async function SignInEmail(formData: {
  email: string;
  password: string;
}) {
  const email = formData.email;
  const password = formData.password;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}

// SignIn with Github
export async function SignInGitHub() {
  const authSocial = await auth.api.signInSocial({
    body: {
      provider: "github",
    },
    headers: await headers(),
  });
  if (!authSocial.url) {
    throw new Error("No URL returned");
  }
  redirect(authSocial.url);
}