import { Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe.js";
import { type RegisterUserDto, registerUserSchema } from "../dtos/register-user.dto.js";
import { AuthService } from "../services/auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register")
  async registerUser(@Body(new ZodValidationPipe(registerUserSchema)) data: RegisterUserDto) {
    const response = await this.authService.register(data);
    return response;
  }
}
