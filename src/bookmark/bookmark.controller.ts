import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkSchema, type CreateBookmarkDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('api/v1/bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  @UsePipes(new ZodValidationPipe(CreateBookmarkSchema))
  async createBookMark(
    @Req() req: any,
    @Body() body: CreateBookmarkDto,
  ): Promise<object> {
    return this.bookmarkService.createBookMark(req, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get("/")
  async getBookmarks(@Req() req: any): Promise<object> {
    return this.bookmarkService.getBookMarks(req);
  }
}
