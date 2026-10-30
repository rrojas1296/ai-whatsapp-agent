import z from "zod";
import { UserRoleEnum } from "../types/models/user.model.js";

export const registerUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(UserRoleEnum),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .max(128, "Máximo 128 caracteres")
    .regex(/[A-Z]/, "Debe contener una mayúscula")
    .regex(/[0-9]/, "Debe contener un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener un carácter especial"),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
