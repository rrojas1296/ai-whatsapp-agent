import {
  AccessTokenPayload,
  RefreshTokenPayload,
  Tokens,
  TokenType,
} from "../types/models/tokens.model.js";

export interface IJwtTokenProvider {
  generateTokens(payload: AccessTokenPayload): Promise<Tokens>;
  verifyToken(token: string, type: TokenType): Promise<AccessTokenPayload | RefreshTokenPayload>;
}

export const JWT_TOKEN_PROVIDER = Symbol("JWT_TOKEN_PROVIDER");
