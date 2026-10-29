import { Injectable } from "@nestjs/common";
import { UserCredendials } from "../models/user-crendentials.model.js";
import { DrizzleService } from "../../../database/drizzle/drizzle.service.js";
import { users } from "../../../database/drizzle/schemas/users.schema.js";
import { and, eq } from "drizzle-orm";
import { sessions } from "../../../database/drizzle/schemas/sessions.schema.js";
import { NewUser } from "../models/new-user.model.js";
import { RegisterUserInput } from "../models/register-user-input.model.js";
import { IAuthRepository } from "../contracts/auth-repository.contract.js";

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private drizzle: DrizzleService) {}

  async findUserByEmail(email: string): Promise<UserCredendials> {
    const [user] = await this.drizzle.db
      .select({ email: users.email, passwordHash: users.passwordHash })
      .from(users)
      .where(and(eq(users.email, email), eq(users.isDeleted, false)));
    return user;
  }

  async createUser(data: Omit<RegisterUserInput, "password">, hash: string): Promise<NewUser> {
    const [newUser] = await this.drizzle.db
      .insert(users)
      .values({ ...data, passwordHash: hash })
      .returning({
        email: users.email,
        id: users.id,
        role: users.role,
      });
    return newUser;
  }

  async createSession(userId: string, refreshHash: string): Promise<string> {
    const [newSession] = await this.drizzle.db
      .insert(sessions)
      .values({
        userId,
        refreshHash,
      })
      .returning({
        id: sessions.id,
      });
    return newSession.id;
  }
}
