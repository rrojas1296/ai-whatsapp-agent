import { NewUser } from "../models/new-user.model.js";
import { RegisterUserInput } from "../models/register-user-input.model.js";
import { UserCredendials } from "../models/user-crendentials.model.js";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<UserCredendials>;

  createUser(data: Omit<RegisterUserInput, "password">, hash: string): Promise<NewUser>;

  createSession(userId: string, refreshHash: string): Promise<string>;
}

export const AUTH_REPOSITORY = Symbol("AUTH_REPOSITORY");
