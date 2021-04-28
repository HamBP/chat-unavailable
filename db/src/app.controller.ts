import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  entryPoint() {
    return {
      ok: true,
    };
  }
}
