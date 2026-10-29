import { UserRole } from "../../../database/drizzle/schemas/users.schema.js";

export interface PayloadJwt {
  sub: string;
  sessionId: string;
  role: UserRole;
}
