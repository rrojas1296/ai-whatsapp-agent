import { Injectable } from "@nestjs/common";
import { DrizzleService } from "../../../database/drizzle/drizzle.service.js";
import { users } from "../../../database/drizzle/schemas/users.schema.js";
import { and, eq } from "drizzle-orm";
import { sessions } from "../../../database/drizzle/schemas/sessions.schema.js";
import { IAuthRepository } from "../contracts/auth-repository.contract.js";
import { InsertUser, NewUser, UserCredentials } from "../types/models/user.model.js";
import { InsertSession } from "../types/models/sessions.model.js";

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUserCredentials(email: string): Promise<UserCredentials | null> {
    const [user] = await this.drizzle.db
      .select({
        email: users.email,
        id: users.id,
        passwordHash: users.passwordHash,
        role: users.role,
      })
      .from(users)
      .where(and(eq(users.email, email), eq(users.isDeleted, false)))
      .limit(1);
    return user ?? null;
  }

  async emailInUse(email: string): Promise<boolean> {
    const [user] = await this.drizzle.db
      .select({
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return Boolean(user);
  }

  async createUser(data: InsertUser): Promise<NewUser> {
    const [newUser] = await this.drizzle.db.insert(users).values(data).returning({
      email: users.email,
      id: users.id,
      role: users.role,
    });
    return newUser;
  }

  async createSession(data: InsertSession): Promise<string> {
    const { userId, refreshHash, id } = data;
    const [newSession] = await this.drizzle.db
      .insert(sessions)
      .values({
        id,
        userId,
        refreshHash,
      })
      .returning({
        id: sessions.id,
      });
    return newSession.id;
  }
}
