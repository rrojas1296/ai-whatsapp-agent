import { UserRole } from "../models/user.model.js";

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  password: string;
}
