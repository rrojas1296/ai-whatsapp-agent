import { UserRole } from "./user.model.js";

export interface Tokens {
  refreshToken: string;
  accessToken: string;
}

export type TokenType = "refresh" | "access";

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
}

export interface AccessTokenPayload extends RefreshTokenPayload {
  role: UserRole;
}
