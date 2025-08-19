import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { LoginDto, RegisterDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/env';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<object> {
    try {
      // check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      // hash password
      const hashedPassword = await argon.hash(data.password);

      // create user
      const newUser = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: { user: newUser },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async login(data: LoginDto): Promise<object> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      // check if user exists
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const pwValid = await argon.verify(user.password, data.password);
      // check if password is valid
      if (!pwValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      // generate token
      const token = await this.signToken(user.id, user.email, {
        expiresIn: "1d",
        secret: JWT_SECRET
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
        data: {
          token,
        },
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: {},
      };
    }
  }

   signToken(userId: number, email: string, options?: object): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwt.signAsync({...payload}, options);
  }
}
