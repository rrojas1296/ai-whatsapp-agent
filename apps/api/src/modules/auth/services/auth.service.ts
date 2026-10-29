import { Inject, Injectable } from "@nestjs/common";
import { RegisterUserInput } from "../models/register-user-input.model.js";
import { AUTH_REPOSITORY, type IAuthRepository } from "../contracts/auth-repository.contract.js";
import {
  HASH_PASSWORD_PROVIDER,
  type IHashPasswordProvider,
} from "../contracts/hash-password.contract.js";
import {
  type IJwtTokenProvider,
  JWT_TOKEN_PROVIDER,
} from "../contracts/jwt-token-provider.contract.js";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @Inject(HASH_PASSWORD_PROVIDER) private readonly hashPasswordProvider: IHashPasswordProvider,
    @Inject(JWT_TOKEN_PROVIDER) private readonly jwtTokenProvider: IJwtTokenProvider,
  ) {}
  async register(data: RegisterUserInput) {
    const { email, role, firstName, lastName, password } = data;

    const hashedPassword = await this.hashPasswordProvider.hash(password);

    const newUser = await this.authRepository.createUser(
      {
        email,
        role,
        firstName,
        lastName,
      },
      hashedPassword,
    );

    const sessionId = uuidv4();

    const tokens = await this.jwtTokenProvider.generateTokens({
      sub: newUser.id,
      role: newUser.role,
      sessionId,
    });

    const refreshHash = await this.hashPasswordProvider.hash(tokens.refreshToken);

    await this.authRepository.createSession(newUser.id, refreshHash);
    return {
      sessionId,
      user: newUser,
    };
  }
}
