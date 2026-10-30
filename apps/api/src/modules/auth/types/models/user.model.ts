export const UserRoleEnum = {
  ADMIN: "admin",
  STAFF: "staff",
} as const;
export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  passwordHash: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type UserCredentials = Pick<User, "id" | "email" | "role" | "passwordHash">;

export type InsertUser = Omit<User, "createdAt" | "updatedAt" | "deletedAt" | "isDeleted">;

export type AuthUser = Omit<UserCredentials, "passwordHash">;

export type NewUser = Pick<User, "id" | "email" | "role">;
