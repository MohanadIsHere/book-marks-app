import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/env';
import { PrismaService } from 'src/prisma/prisma.service';
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
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    

    return user;
  }
}
