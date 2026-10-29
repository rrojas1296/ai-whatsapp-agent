import { UserRole } from "../../../database/drizzle/schemas/users.schema.js";

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  password: string;
}
