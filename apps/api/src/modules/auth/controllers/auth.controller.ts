import { Body, Controller, Post, Res } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe.js";
import { type RegisterUserDto, registerUserSchema } from "../dtos/register-user.dto.js";
import { AuthService } from "../services/auth.service.js";
import { AuthCookiesProvider } from "../http/auth-cookies.js";
import { type Response } from "express";
import { type LoginUserDto, loginUserSchema } from "../dtos/login-user.dto.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookiesProvider: AuthCookiesProvider,
  ) {}

  @Post("register")
  async registerUser(
    @Res({ passthrough: true }) response: Response,
    @Body(new ZodValidationPipe(registerUserSchema)) body: RegisterUserDto,
  ) {
    const data = await this.authService.register(body);
    this.authCookiesProvider.setCookies(response, data.tokens);
    return data.user;
  }

  @Post("login")
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body(new ZodValidationPipe(loginUserSchema)) body: LoginUserDto,
  ) {
    const data = await this.authService.login(body);
    this.authCookiesProvider.setCookies(response, data.tokens);
    return data.user;
  }
}
