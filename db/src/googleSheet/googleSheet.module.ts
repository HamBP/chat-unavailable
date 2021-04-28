import { Module } from '@nestjs/common';
import { GoogleSheetController } from './googleSheet.controller';
import { GoogleSheetService } from './googleSheet.service';

@Module({
  controllers: [GoogleSheetController],
  providers: [GoogleSheetService],
})
export class GoogleSheetModule {}
