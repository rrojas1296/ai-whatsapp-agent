import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IJwtTokenProvider } from "../contracts/jwt-token-provider.contract.js";
import { AuthTokens, TokenType } from "../models/auth-tokens.model.js";
import { PayloadJwt } from "../models/payload-jwt.model.js";
import { ConfigService } from "@nestjs/config";
import { Environments } from "../../../config/environment.js";
import { jwtVerify, SignJWT } from "jose";
import { randomUUID } from "crypto";

@Injectable()
export class JwtTokenProvider implements IJwtTokenProvider {
  accessSecret: Uint8Array;
  refreshSecret: Uint8Array;
  constructor(private readonly config: ConfigService<Environments, true>) {
    this.accessSecret = new TextEncoder().encode(config.get("ACCESS_SECRET"));
    this.refreshSecret = new TextEncoder().encode(config.get("REFRESH_SECRET"));
  }

  async generateTokens({ sub, sessionId, role }: PayloadJwt): Promise<AuthTokens> {
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
      .setExpirationTime(this.config.get("ACCESS_TOKEN_EXPIRATION_TIME"))
      .sign(this.accessSecret);
    const refreshToken = await new SignJWT(refreshPayload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(sub)
      .setIssuedAt()
      .setJti(randomUUID())
      .setExpirationTime(this.config.get("REFRESH_TOKEN_EXPIRATION_TIME"))
      .sign(this.refreshSecret);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, type: TokenType): Promise<PayloadJwt> {
    const s = type === "access" ? this.accessSecret : this.refreshSecret;
    const { payload } = await jwtVerify<PayloadJwt>(token, s, {
      algorithms: ["HS256"],
    });
    if (!payload.sub) throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
    return {
      sub: payload.sub,
      sessionId: payload.sessionId,
      role: payload.role,
    };
  }
}
