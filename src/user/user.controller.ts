import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import type { UpdateUserDto } from './dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: any): Promise<object> {
    return this.userService.getMe(req);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  updateUser(@Req() req: any, @Body() body: UpdateUserDto): Promise<object> {
    return this.userService.updateUser(req, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  deleteUser(@Req() req: any): Promise<object> {
    return this.userService.deleteUser(req);
  }
}
