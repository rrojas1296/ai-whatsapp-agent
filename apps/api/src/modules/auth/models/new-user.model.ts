import { UserRole } from "../../../database/drizzle/schemas/users.schema.js";

export interface NewUser {
  email: string;
  id: string;
  role: UserRole;
}
