import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IJwtTokenProvider } from "../contracts/jwt-token-provider.contract.js";
import { ConfigService } from "@nestjs/config";
import { Environments } from "../../../config/environment.js";
import { jwtVerify, SignJWT } from "jose";
import { randomUUID } from "crypto";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  Tokens,
  TokenType,
} from "../types/models/tokens.model.js";

@Injectable()
export class JwtTokenProvider implements IJwtTokenProvider {
  accessSecret: Uint8Array;
  refreshSecret: Uint8Array;
  constructor(private readonly config: ConfigService<Environments, true>) {
    this.accessSecret = new TextEncoder().encode(config.get("ACCESS_SECRET"));
    this.refreshSecret = new TextEncoder().encode(config.get("REFRESH_SECRET"));
  }

  async generateTokens({ sub, sessionId, role }: AccessTokenPayload): Promise<Tokens> {
    const accessPayload = {
      sub,
      role,
      sessionId,
    };
    const refreshPayload = {
      sub,
      sessionId,
    };
    const accessToken = await new SignJWT(accessPayload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(sub)
      .setIssuedAt()
      .setJti(randomUUID())
      .setIssuer(this.config.get("AUTH_ISSUER"))
      .setAudience(this.config.get("AUTH_AUDIENCE"))
      .setExpirationTime(this.config.get("ACCESS_TOKEN_EXPIRATION_TIME"))
      .sign(this.accessSecret);
    const refreshToken = await new SignJWT(refreshPayload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(sub)
      .setIssuedAt()
      .setJti(randomUUID())
      .setIssuer(this.config.get("AUTH_ISSUER"))
      .setAudience(this.config.get("AUTH_AUDIENCE"))
      .setExpirationTime(this.config.get("REFRESH_TOKEN_EXPIRATION_TIME"))
      .sign(this.refreshSecret);

    return { accessToken, refreshToken };
  }

  async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<AccessTokenPayload | RefreshTokenPayload> {
    try {
      const secret = type === "access" ? this.accessSecret : this.refreshSecret;
      const { payload } = await jwtVerify(token, secret, {
        algorithms: ["HS256"],
        issuer: this.config.get("AUTH_ISSUER"),
        audience: this.config.get("AUTH_AUDIENCE"),
        requiredClaims: ["sub", "iat", "exp", "jti"],
      });
      if (typeof payload.sub !== "string" || typeof payload.sessionId !== "string") {
        throw new Error("Invalid token payload");
      }

      const sessionPayload: RefreshTokenPayload = {
        sub: payload.sub,
        sessionId: payload.sessionId,
      };

      if (type === "refresh") return sessionPayload;

      if (payload.role !== "admin" && payload.role !== "staff") {
        throw new Error("Invalid access token role");
      }

      return { ...sessionPayload, role: payload.role };
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
