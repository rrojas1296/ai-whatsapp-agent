import { Injectable } from "@nestjs/common";
import { IAuthCookiesProvider } from "../contracts/auth-cookies-provider.contract.js";
import { CookieOptions, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { Environments, NodeEnvEnum } from "../../../config/environment.js";
import { Tokens } from "../types/models/tokens.model.js";

@Injectable()
export class AuthCookiesProvider implements IAuthCookiesProvider {
  private names: {
    access: string;
    refresh: string;
  };
  private prefix: string;

  private options: CookieOptions;

  constructor(private readonly config: ConfigService<Environments, true>) {
    const isProd = this.config.get("NODE_ENV") === NodeEnvEnum.PROD;
    this.prefix = isProd ? "__Host-" : "dev-";
    this.names = {
      access: `${this.prefix}access`,
      refresh: `${this.prefix}refresh`,
    };
    this.options = {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    };
  }

  setCookies(response: Response, tokens: Tokens): void {
    response.cookie(this.names.access, tokens.accessToken, {
      ...this.options,
      maxAge: this.config.get("ACCESS_TOKEN_EXPIRATION_TIME"),
    });
    response.cookie(this.names.refresh, tokens.refreshToken, {
      ...this.options,
      maxAge: this.config.get("REFRESH_TOKEN_EXPIRATION_TIME"),
    });
  }

  clear(response: Response): void {
    for (const name of Object.values(this.names)) response.clearCookie(name, this.options);
  }
}
