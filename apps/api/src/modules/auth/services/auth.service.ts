import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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
import { RegisterUserInput } from "../types/inputs/register-user.input.js";
import { LoginUserInput } from "../types/inputs/login-user.input.js";
import { Tokens } from "../types/models/tokens.model.js";
import { AuthUser } from "../types/models/user.model.js";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @Inject(HASH_PASSWORD_PROVIDER) private readonly hashPasswordProvider: IHashPasswordProvider,
    @Inject(JWT_TOKEN_PROVIDER) private readonly jwtTokenProvider: IJwtTokenProvider,
  ) {}

  async register(
    data: RegisterUserInput,
  ): Promise<{ sessionId: string; user: AuthUser; tokens: Tokens }> {
    const { email, role, firstName, lastName, password } = data;

    const inUse = await this.authRepository.emailInUse(email);
    if (inUse) throw new HttpException("Email is already in use", HttpStatus.BAD_REQUEST);

    const passwordHash = await this.hashPasswordProvider.hash(password);
    const userId = uuidv4();

    const newUser = await this.authRepository.createUser({
      id: userId,
      email,
      role,
      firstName,
      lastName,
      passwordHash,
    });
    const { sessionId, tokens } = await this.createAuthSession(newUser);
    return {
      sessionId,
      user: newUser,
      tokens,
    };
  }

  async login(data: LoginUserInput): Promise<{ tokens: Tokens; user: AuthUser }> {
    const { email, password } = data;
    const userDB = await this.authRepository.findUserCredentials(email);
    if (!userDB) throw new HttpException("User email is not found", HttpStatus.UNAUTHORIZED);

    const passwordMatch = await this.hashPasswordProvider.verify(password, userDB.passwordHash);

    if (!passwordMatch) throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);

    const user: AuthUser = {
      id: userDB.id,
      role: userDB.role,
      email: userDB.email,
    };
    const { tokens } = await this.createAuthSession(user);

    return {
      tokens,
      user,
    };
  }

  private async createAuthSession(user: AuthUser): Promise<{ sessionId: string; tokens: Tokens }> {
    const sessionId = uuidv4();

    const tokens = await this.jwtTokenProvider.generateTokens({
      sub: user.id,
      role: user.role,
      sessionId,
    });

    const refreshHash = await this.hashPasswordProvider.hash(tokens.refreshToken);

    await this.authRepository.createSession({
      id: sessionId,
      userId: user.id,
      refreshHash,
    });

    return { sessionId, tokens };
  }
}
