import { z } from "zod";

export const RoleEnum = z.enum(["USER", "ADMIN"]);

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().url().nullable(),
  bio: z.string().nullable(),
  role: RoleEnum.default("USER"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserPublicSchema = UserSchema.pick({
  id: true,
  name: true,
  image: true,
  role: true,
});

export type User = z.infer<typeof UserSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
export type Role = z.infer<typeof RoleEnum>;
