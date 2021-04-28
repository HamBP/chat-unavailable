import { Controller, Get } from '@nestjs/common';

@Controller('googlesheetreporter')
export class GoogleSheetController {
  @Get()
  async entryPoint() {}
  @Get('attendance')
  async Attendance() {}
  @Get('bug')
  async Bug() {}
  @Get('conference')
  async Conference() {}
}
