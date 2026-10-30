import { InsertSession } from "../types/models/sessions.model.js";
import { InsertUser, NewUser, UserCredentials } from "../types/models/user.model.js";

export interface IAuthRepository {
  findUserCredentials(email: string): Promise<UserCredentials | null>;

  emailInUse(email: string): Promise<boolean>;

  createUser(data: InsertUser): Promise<NewUser>;

  createSession(data: InsertSession): Promise<string>;
}

export const AUTH_REPOSITORY = Symbol("AUTH_REPOSITORY");
