import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return { message: 'CaptaApp API is running!' };
  }
}







