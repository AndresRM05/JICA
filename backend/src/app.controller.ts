import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return 'Hello World!';
  }

  getHello() {
    return this.getRoot();
  }
}
