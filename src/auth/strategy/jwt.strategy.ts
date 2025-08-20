import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/env';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

interface IJwtPayload {
  sub: number;
  email: string;
}

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    // check if token is revoked
    const revoked = await this.prisma.revokeToken.findFirst({
      where: {token}
    });

    if (revoked) {
      throw new HttpException('Token revoked', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { user, token };
  }
}
