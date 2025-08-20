import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { UpdateUserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(@Req() req: any): Promise<object> {
    try {
      return {
        message: 'User Retrieved Successfully',
        data: {
          user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error,
      };
    }
  }

  async updateUser(
    @Req() req: any,
    @Body() body: UpdateUserDto,
  ): Promise<object> {
    try {
      if (!body || Object.keys(body).length === 0) {
        throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
      }
      if (body.password) {
        const hashed = await argon.hash(body.password);
        body.password = hashed;
      }
      await this.prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          ...body,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error,
      };
    }
  }

  async deleteUser(@Req() req: any): Promise<object> {
    try {
      
      await this.prisma.revokeToken.create({
        data: {
          token: req.user.token
        }
      })
     
      await this.prisma.user.delete({
        where: {
          id: req.user.id,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error,
      };
    }
  }
}
