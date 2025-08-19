import {  Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from 'src/config/env';
@Injectable()
export class PrismaService extends PrismaClient{
  constructor() {
    super({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }
}