import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service.js";
import { AuthController } from "./controllers/auth.controller.js";
import { AuthRepository } from "./respositories/auth.repository.js";
import { DatabaseModule } from "../../database/database.module.js";
import { AUTH_REPOSITORY } from "./contracts/auth-repository.contract.js";
import { HASH_PASSWORD_PROVIDER } from "./contracts/hash-password.contract.js";
import { HashPasswordProvider } from "./providers/hash-password.provider.js";
import { JWT_TOKEN_PROVIDER } from "./contracts/jwt-token-provider.contract.js";
import { JwtTokenProvider } from "./providers/jwt-token.provider.js";
import { AuthCookiesProvider } from "./http/auth-cookies.js";

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule],
  providers: [
    AuthService,
    AuthCookiesProvider,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    {
      provide: HASH_PASSWORD_PROVIDER,
      useClass: HashPasswordProvider,
    },
    {
      provide: JWT_TOKEN_PROVIDER,
      useClass: JwtTokenProvider,
    },
  ],
})
export class AuthModule {}
