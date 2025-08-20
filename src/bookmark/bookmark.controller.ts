import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import {
  CreateBookmarkSchema,
  type updateBookmarkDto,
  type CreateBookmarkDto,
  UpdateBookmarkSchema,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('api/v1/bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  @UsePipes(new ZodValidationPipe(CreateBookmarkSchema))
  async createBookmark(
    @Req() req: any,
    @Body() body: CreateBookmarkDto,
  ): Promise<object> {
    return this.bookmarkService.createBookmark(req, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getBookmarks(@Req() req: any): Promise<object> {
    return this.bookmarkService.getBookmarks(req);
  }
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getBookmark(@Req() req: any): Promise<object> {
    return this.bookmarkService.getBookmark(req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ZodValidationPipe(UpdateBookmarkSchema))
  async updateBookmark(
    @Req() req: any,
    @Body() body: updateBookmarkDto,
  ): Promise<object> {
    return this.bookmarkService.updateBookmark(req, body);
  }
  @Delete("user/:id")
  @UseGuards(AuthGuard('jwt'))
  async deleteBookmark(@Req() req: any): Promise<object> {
    return this.bookmarkService.deleteBookmark(req);
  }
  @Delete("user")
  @UseGuards(AuthGuard('jwt'))
  async deleteAllUserBookmarks(@Req() req: any): Promise<object> {
    return this.bookmarkService.deleteAllUserBookmarks(req);
  }
  @Delete("/")
  @UseGuards(AuthGuard('jwt'))
  async deleteAllBookmarks(@Req() req: any): Promise<object> {
    return this.bookmarkService.deleteAllBookmarks(req);
  }
}
