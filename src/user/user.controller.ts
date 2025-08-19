import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/auth/strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Req() req: any) : Promise<object>{
    return this.userService.getMe(req);
  }
}
