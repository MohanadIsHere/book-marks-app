import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import type { CreateBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async createBookMark(
    @Req() req: any,
    @Body() body: CreateBookmarkDto,
  ): Promise<object> {
    try {
      const { user } = req;
      if (Object.values(body).length === 0) {
        throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
      }
      const bookMark = await this.prisma.bookMark.create({
        data: {
          ...body,
          // user,
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          description: body.description ? true : false,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          userId: true,
        },
      });

      return {
        message: 'Bookmark created successfully',
        data: {
          bookmark: bookMark,
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

  async getBookMarks(@Req() req: any): Promise<object> {
    try {
      const { id } = req.user;
      const bookmarks = await this.prisma.bookMark.findMany({
        where: {
          userId: id,
        }
      });
      if (!bookmarks) {
        throw new HttpException(
          'No bookmarks found for this user',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Bookmarks retrieved successfully',
        data: {
          bookmarks,
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
}
