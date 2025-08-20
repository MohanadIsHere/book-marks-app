import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import type { CreateBookmarkDto, updateBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async createBookmark(
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

  async getBookmarks(@Req() req: any): Promise<object> {
    try {
      const { id } = req.user;
      const bookmarks = await this.prisma.bookMark.findMany({
        where: {
          userId: id,
        },
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
  async getBookmark(@Req() req: any): Promise<object> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
      }
      const bookmark = await this.prisma.bookMark.findUnique({
        where: {
          id,
        },
      });
      if (!bookmark) {
        throw new HttpException('Bookmark not found', HttpStatus.NOT_FOUND);
      }

      if (bookmark.userId !== Number(req.user.id)) {
        throw new HttpException(
          'You are not the owner of this bookmark',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return {
        message: 'Bookmark retrieved successfully',
        data: {
          bookmark,
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
  async updateBookmark(
    @Req() req: any,
    @Body() body: updateBookmarkDto,
  ): Promise<object> {
    try {
      if (Object.keys(body).length === 0 || !body) {
        throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
      }
      const bookId = Number(req.params.id);
      const { user } = req;
      if (isNaN(bookId)) {
        throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
      }
      const bookmark = await this.prisma.bookMark.findUnique({
        where: {
          id: bookId,
        },
      });
      if (!bookmark) {
        throw new HttpException('Bookmark not found', HttpStatus.NOT_FOUND);
      }
      if (bookmark.userId !== user.id) {
        throw new HttpException(
          'You are not the owner of this bookmark',
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.prisma.bookMark.update({
        where: {
          id: bookId,
        },
        data: {
          ...body,
        },
      });

      return {
        message: 'Bookmark updated successfully',
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
  async deleteBookmark(@Req() req: any): Promise<object> {
    try {
      const bookId = Number(req.params.id);
      const { user } = req;
      if (isNaN(bookId)) {
        throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
      }
      const bookmark = await this.prisma.bookMark.findUnique({
        where: {
          id: bookId,
        },
      });
      if (!bookmark) {
        throw new HttpException('Bookmark not found', HttpStatus.NOT_FOUND);
      }
      if (bookmark.userId !== user.id) {
        throw new HttpException(
          'You are not the owner of this bookmark',
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.prisma.bookMark.delete({
        where: {
          id: bookId,
        },
      });
      return {
        message: 'Bookmark deleted successfully',
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
  async deleteAllUserBookmarks(@Req() req: any): Promise<object> {
    try {
      const { user } = req;

      const bookmarks = await this.prisma.bookMark.deleteMany({
        where: {
          userId: user.id,
        },
      });
      if (bookmarks.count === 0) {
        throw new HttpException(
          'No bookmarks found for this user',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: "All user's bookmarks deleted successfully",
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
  async deleteAllBookmarks(@Req() req: any): Promise<object> {
    try {
      const { user } = req;
      
      if (user.role !== UserRole.admin) {
        throw new HttpException(
          'You are not an admin to perform this action',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const bookmarks = await this.prisma.bookMark.deleteMany();
      if (bookmarks.count === 0) {
        throw new HttpException('No bookmarks found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'All bookmarks deleted successfully',
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
