import z from "zod";
import { UserRoleEnum } from "../../../database/drizzle/schemas/users.schema.js";

export const registerUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(UserRoleEnum),
  email: z.email(),
  password: z.string(),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
