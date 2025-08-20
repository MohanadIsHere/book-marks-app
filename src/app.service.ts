import { HttpCode, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @HttpCode(200)
  getHello(): object {
    return {message: "Welcome To Bookmarks API 🚀 !"}
  }
}
