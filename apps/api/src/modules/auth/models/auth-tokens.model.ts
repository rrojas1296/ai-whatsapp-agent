export interface AuthTokens {
  refreshToken: string;
  accessToken: string;
}

export type TokenType = "refresh" | "access";
