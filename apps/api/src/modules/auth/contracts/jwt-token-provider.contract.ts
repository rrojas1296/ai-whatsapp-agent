import { AuthTokens, TokenType } from "../models/auth-tokens.model.js";
import { PayloadJwt } from "../models/payload-jwt.model.js";

export interface IJwtTokenProvider {
  generateTokens(payload: PayloadJwt): Promise<AuthTokens>;
  verifyToken(token: string, type: TokenType): Promise<PayloadJwt>;
}

export const JWT_TOKEN_PROVIDER = Symbol("JWT_TOKEN_PROVIDER");
