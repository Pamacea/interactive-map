import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { anonymous, username } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {  
        enabled: true
    },
    socialProviders: { 
        github: { 
           clientId: process.env.GITHUB_CLIENT_ID as string, 
           clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
    }, 
    plugins: [
        username(),
        anonymous(),
        admin(),
        nextCookies(), // At the end
      ],
});