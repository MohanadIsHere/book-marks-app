import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { LoginSchema, RegisterSchema } from './dto';
import type { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor( private authService: AuthService) {}
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  @Post('register')
  register(@Body() body: RegisterDto): object {
    return this.authService.register(body);
  }
  @UsePipes(new ZodValidationPipe(LoginSchema))
  @Post('login')
  login (@Body() body: LoginDto): object {
    return this.authService.login(body);
  }
}
